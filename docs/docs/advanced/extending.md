---
title: Extending
description: Adding custom event types, richer notification payloads, and per-store routing — the codebase is intentionally small enough to fork.
---

# Extending

The whole module is under 500 lines of PHP. The patterns below cover the
three most common extension requests.

## The architecture in 30 seconds

Three classes do the work:

| Class | Job |
|---|---|
| `Byte8\PingBell\Model\Config` | Reads the master switch, decrypts the API key, returns per-event PingBell IDs. |
| `Byte8\PingBell\Model\PingBellClient` | One method to fetch bells, one method to send a notification. cURL-based, 5-second timeout. |
| `Byte8\PingBell\Observer\SendPingBellNotification` | Generic observer. Constructor takes an `eventKey` string. The five built-in events are virtualTypes that bind the same class to different keys via `di.xml`. |

The trick is that **`SendPingBellNotification` is event-agnostic** — it
just looks up the configured PingBell ID for whatever `eventKey` it was
constructed with. Adding a new event = adding a virtualType + an
`events.xml` registration.

## Pattern 1 — add a custom event

Say you want a buzz on **`newsletter_subscriber_save_commit_after`** —
fires when someone signs up to your newsletter.

**Step 1.** Add a virtualType in your project's `app/code/Vendor/Module/etc/di.xml`:

```xml
<virtualType name="Vendor\Module\Observer\SendNewsletterNotification"
             type="Byte8\PingBell\Observer\SendPingBellNotification">
    <arguments>
        <argument name="eventKey" xsi:type="string">newsletter_signup</argument>
    </arguments>
</virtualType>
```

**Step 2.** Wire it to the event in `events.xml`:

```xml
<event name="newsletter_subscriber_save_commit_after">
    <observer name="vendor_pingbell_newsletter"
              instance="Vendor\Module\Observer\SendNewsletterNotification"/>
</event>
```

**Step 3.** Add the config field. Either extend
`etc/adminhtml/system.xml` to add a `newsletter_signup_pingbell_id`
input under the same `events` group, or just store the bell ID via a
data patch.

Done. Run `bin/magento setup:upgrade` and `cache:flush`, save the new
PingBell ID, sign up to your own newsletter for the test buzz.

## Pattern 2 — richer notification payloads

The current `PingBellClient::sendNotification()` sends an empty `POST`.
The notification text on the device comes from the bell's saved title.
If you want order numbers, customer names, totals etc. in the
notification body, override the client.

```php
namespace Vendor\Module\Model;

class RichPingBellClient extends \Byte8\PingBell\Model\PingBellClient
{
    public function sendOrderNotification(string $pingBellId, \Magento\Sales\Api\Data\OrderInterface $order): bool
    {
        $message = sprintf(
            '#%s — €%s from %s',
            $order->getIncrementId(),
            $order->getGrandTotal(),
            $order->getCustomerEmail()
        );

        // PingBell's API: POST /log?id=BELL_ID with optional `message` query param
        // (see pingbell.io API docs for current parameter naming)
        $url = 'https://app.pingbell.io/log?'
             . http_build_query(['id' => $pingBellId, 'message' => $message]);

        // ... rest of cURL identical to parent ...
    }
}
```

Then write your own observer that calls `sendOrderNotification($id, $order)`
instead of the generic `sendNotification($id)`. Wire it via `events.xml`
the same way as a custom event, but pointing at your own observer class
rather than the generic virtualType.

:::note PingBell API parameters
Check the latest [PingBell API documentation](https://pingbell.io)
for the current request format — at the time of writing, the bell title
is the message body, and arbitrary message text per call is a
forthcoming feature. Test before relying on it.
:::

## Pattern 3 — per-store routing

The module is currently `showInDefault="1" showInWebsite="0"
showInStore="0"` — i.e. **default scope only**. Multi-store stores
sometimes want to route Store A's order pings to one bell and Store B's
to another.

The cleanest way:

**Step 1.** Override `etc/adminhtml/system.xml` in your project module
to widen the scope:

```xml
<field id="new_order_pingbell_id" ... showInDefault="1" showInWebsite="1" showInStore="1">
    <!-- ... -->
</field>
```

**Step 2.** Make the `Config::getPingBellId()` lookup store-aware:

```php
public function getPingBellId(string $eventKey, ?int $storeId = null): string
{
    return (string) $this->scopeConfig->getValue(
        self::XML_PATH_EVENT_PREFIX . $eventKey . '_pingbell_id',
        \Magento\Store\Model\ScopeInterface::SCOPE_STORE,
        $storeId
    );
}
```

**Step 3.** In your custom observer, pass the order's `$store_id` to
the lookup. The built-in observer doesn't do this — `getPingBellId()`
in the shipped Config reads only at default scope.

A complete worked example for this lives at
[the GitHub examples directory](https://github.com/byte8io/magento-pingbell/tree/main/examples)
once the issue is open — file an issue if you'd like us to ship it.

## Where the patterns *don't* live

- **No retry queue.** If pingbell.io is down when an event fires, the
  notification is lost. Adding retries means adding a database queue
  and a cron — it's a different kind of module. The Stock Radar
  module's dispatch table is a good reference if you want to bolt
  one on, but that's a project, not a config flag.
- **No batch / digest mode.** The module sends one PingBell HTTP call
  per Magento event. To batch (e.g. one buzz per N orders), again you
  need state — a small table or a cache key — that's not in scope here.

## Issues and PRs welcome

If you build something useful — please open a PR or share a gist on
[GitHub](https://github.com/byte8io/magento-pingbell). The module
intentionally stays small; the natural place for community extensions
is documentation links and recipes, not feature creep into core.
