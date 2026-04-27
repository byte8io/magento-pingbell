---
title: Your first notification
description: A 60-second smoke test to confirm Magento is talking to PingBell, end-to-end.
---

# Your first notification

After install, before you wire up all five events, it's worth proving the
end-to-end pipe works for one event. The fastest is **New Order**.

## Set up the pipe

1. **Stores → Configuration → Byte8 → PingBell Notifications**.
2. **Enable** = **Yes**.
3. Paste your **API Key**. Click **Save Config**.
4. Scroll to **Event Notifications → New Order**, click **Fetch Bells**.
5. Pick any bell from the dropdown. The **PingBell ID** field below
   auto-fills.
6. Click **Save Config**.

## Make sure the bell is reachable

Open the PingBell app on whatever device you want to receive the buzz —
phone, browser tab, watch. Confirm the device is logged in to the same
PingBell account.

A good zero-Magento sanity check is to manually trigger the bell from the
PingBell dashboard ("Send test notification" or similar). If that doesn't
arrive on your device, the issue is at the PingBell side — fix it there
before bringing Magento into the picture.

## Place a test order

The cheapest way: a Magento backend "Create New Order" with a 0.01€ test
product. Or simply walk through checkout on your storefront with a test
customer account.

What should happen, in order:

1. **Inside ~1 second** of clicking "Place Order": the device with the
   PingBell app buzzes.
2. The PingBell dashboard shows a new entry on the bell you wired up.
3. `var/log/pingbell.log` gets a new line:

   ```
   [2026-04-26T13:00:01+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: Ljgkg6if7Tbx6x0n6jiv
   [2026-04-26T13:00:01+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_order
   ```

## If nothing happened

Walk down this list before assuming the module is broken:

| Symptom | Most likely cause |
|---|---|
| **No log line at all** | Module not enabled, or **Enable PingBell Notifications** is set to No |
| **Log line says "PingBell notification failed"** | Wrong PingBell ID, or the bell was deleted in PingBell |
| **Log line says "PingBell sendNotification error"** | Network problem — check outbound HTTPS to `app.pingbell.io` is permitted |
| **No buzz, but log says "sent"** | PingBell-side issue — device not subscribed to that bell, or app permissions not granted |

The full debug walkthrough is on the
[Troubleshooting page](/docs/advanced/troubleshooting).

## Now wire the rest

Once you've seen the first ping arrive, the other four events are just
copies of the same flow — for each row in the Event Notifications group,
click **Fetch Bells**, pick a bell, save. Or skip the ones you don't care
about by leaving the PingBell ID empty.
