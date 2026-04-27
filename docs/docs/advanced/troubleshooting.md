---
title: Troubleshooting
description: When the buzz doesn't arrive — a diagnostic walkthrough from "no log line at all" to "log says success but device is silent".
---

# Troubleshooting

When a notification doesn't arrive, work down this list in order. The
diagnostic question is **"how far through the pipe did the request
get?"** — and the answer is in `var/log/pingbell.log`.

## Step 1 — is the module actually firing?

```bash
tail -f var/log/pingbell.log
```

…then trigger the event (place a test order, save an invoice). One of
three things happens:

- **A new line appears** → skip to step 3.
- **No new line at all** → step 2.
- **File doesn't exist** → step 2.

## Step 2 — module isn't running the observer

Most common causes:

| Cause | Check |
|---|---|
| Module not enabled | `bin/magento module:status Byte8_PingBell` |
| Master switch off | Stores → Configuration → Byte8 → PingBell Notifications → Enable = **No** |
| PingBell ID empty for that event | Same admin page, *Event Notifications* group |
| Cache stale after install | `bin/magento cache:flush` |
| DI compile not run | `bin/magento setup:di:compile` |
| Pre-Magento 2.4 PHP version | Module requires PHP 8.1+ |

If the module is enabled, the master switch is on, and the PingBell ID
is set, but no log line appears — run a manual cache:flush and
DI compile again. Magento's auto-compile is fragile in some hosting
setups.

## Step 3 — log says "PingBell notification sent" but device is silent

This means **Magento is fine** — the request reached PingBell with a 2xx
response. The problem is on the PingBell / device side:

- The bell ID in Magento is **wrong** (e.g. typo'd manually instead of
  using **Fetch Bells**) — but a wrong ID usually returns 4xx, not 2xx.
  Check the bell exists by visiting `https://app.pingbell.io/log?id=YOUR_ID`.
- The **device isn't subscribed** to that specific bell. PingBell
  separates "ping a bell" from "subscribe a device to a bell" — make
  sure your phone is subscribed to the bell you wired up.
- The PingBell **app permissions** are off (notifications disabled at
  OS level, do-not-disturb on).
- For browser/desktop bells: the **browser tab is closed** or the
  desktop client isn't running.

## Step 4 — log says WARNING with status 4xx

```
PingBell notification failed with status 401 for bell ID: ...
```

| Status | Meaning |
|---|---|
| 401 / 403 | API key is missing or invalid. Re-paste it on the General settings page. |
| 404 | The bell ID was deleted on the PingBell side, or it never existed. Use **Fetch Bells** to pick a current one. |
| 429 | Rate limited. PingBell free-tier may throttle high-volume stores — check your account tier. |
| 5xx | PingBell-side outage. Re-run the test in a few minutes. |

## Step 5 — log says ERROR with cURL message

```
PingBell sendNotification error: cURL error 28: connection timed out
```

This is a network-level problem on the Magento server:

- **Outbound HTTPS blocked.** Many production hosts firewall outbound
  connections by default. Whitelist `app.pingbell.io` (port 443).
- **DNS issues.** `nslookup app.pingbell.io` from the Magento server
  to confirm.
- **TLS issues** (very old PHP / cURL builds). Module needs TLS 1.2+.
- **Container egress.** If Magento runs in a Docker / k8s container,
  check the network policy.

A useful one-line test from the Magento server:

```bash
curl -v -m 5 https://app.pingbell.io/userPingbells?api_key=YOUR_KEY
```

If `curl` works from CLI but the module times out, it's almost always
that PHP-FPM is using a different DNS resolver or proxy than the shell.

## Step 6 — Fetch Bells dropdown is empty

You clicked **Fetch Bells**, no error appeared, but the dropdown is
empty.

- **API key is right but you haven't created any bells yet.** Go to
  [app.pingbell.io](https://app.pingbell.io), create one, click
  Fetch Bells again.
- **API key is wrong.** The fetch endpoint returns an empty array on
  authentication failure on some account states. Re-paste the key,
  Save Config, retry.
- **Saved key is masked.** The controller falls back to the saved
  (decrypted) value when the field shows `******`, but if you've
  pasted a new key without saving, the fetch goes out with the old
  one. Save first, then fetch.

## Still stuck?

Open an issue on
[GitHub](https://github.com/byte8io/magento-pingbell/issues) with:

- Your Magento and PHP versions.
- The module version.
- A redacted `pingbell.log` snippet (mask the bell ID).
- The output of `bin/magento module:status Byte8_PingBell`.
