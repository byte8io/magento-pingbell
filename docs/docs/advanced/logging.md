---
title: Logging
description: var/log/pingbell.log — where every PingBell call, success or failure, is recorded.
---

# Logging

PingBell writes to its own log file, separate from `system.log`. Every
attempted notification — success, warning, or exception — has a single
line in `var/log/pingbell.log`.

## File location

```
<MAGENTO_ROOT>/var/log/pingbell.log
```

Configured via a virtualType in `etc/di.xml`:

```xml
<virtualType name="Byte8\PingBell\Logger\Handler" type="Magento\Framework\Logger\Handler\Base">
    <arguments>
        <argument name="fileName" xsi:type="string">/var/log/pingbell.log</argument>
    </arguments>
</virtualType>
```

The file is created on first use — i.e. the first time an enabled event
fires after install. Until then, it doesn't exist.

## What gets logged

Every observer logs **on success** and **on failure**:

| Level | When | Example |
|---|---|---|
| `INFO` | Notification sent successfully | `PingBell notification sent for bell ID: Ljgkg6if7Tbx6x0n6jiv` |
| `INFO` | Per-event marker after success | `PingBell notification sent for event: new_order` |
| `WARNING` | PingBell API returned non-2xx | `PingBell notification failed with status 401 for bell ID: Ljg...` |
| `WARNING` | `userPingbells` returned non-2xx | `PingBell fetchBells returned status 401` |
| `ERROR` | cURL exception (timeout, DNS, TLS) | `PingBell sendNotification error: cURL error 28: connection timed out` |
| `ERROR` | Observer-level exception | `PingBell observer error (new_order): ...` |

## Reading it

A typical happy-path order ping looks like:

```
[2026-04-26T10:21:33+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: Ljgkg6if7Tbx6x0n6jiv
[2026-04-26T10:21:33+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_order
```

A failure (wrong API key) looks like:

```
[2026-04-26T10:24:01+00:00] byte8_pingbell.WARNING: PingBell notification failed with status 401 for bell ID: Ljgkg6if7Tbx6x0n6jiv
```

A network outage looks like:

```
[2026-04-26T10:25:18+00:00] byte8_pingbell.ERROR: PingBell sendNotification error: cURL error 28: Operation timed out after 5000 milliseconds
```

## What is *not* logged

- **Skipped events.** If the module is disabled, or the PingBell ID for
  that event is empty, the observer early-returns *before* the logger
  is involved. There's no "skipped" log line — silent skip is the
  point.
- **Magento-side payload.** The current implementation sends a
  payload-less POST. Order numbers, customer names, totals are not in
  the request, so they're not in the log either. (See
  [Extending](/docs/advanced/extending) for adding payload data.)
- **The API key.** The logger never writes the decrypted API key to disk.

## Log rotation

`var/log/pingbell.log` follows the same conventions as Magento's own
log files — Magento doesn't ship rotation. On a production server use
`logrotate` (or your hosting platform's equivalent) targeting
`var/log/*.log`.

## Disabling logging

There's no "disable logging" config flag — the lines are useful enough
that the module emits them unconditionally. If you want PingBell silent,
remove or override the `Byte8\PingBell\Logger\Handler` virtualType in a
project-level `di.xml`.

## Reading from CLI in real time

```bash
tail -f var/log/pingbell.log
```

A handy smoke-test pattern: open this in one terminal, place a test
order in another, and you'll see the success log line appear within a
second.
