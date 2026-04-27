---
title: Quick start
description: Install Byte8 PingBell in 5 minutes — Composer, enable, paste API key, click Fetch Bells, place a test order.
---

# Quick start

Five-minute install. Composer pulls the module, one CLI command enables it,
the admin UI handles the rest.

## 1. Have a PingBell account

If you haven't yet:

1. Go to [pingbell.io](https://pingbell.io) and create an account.
2. Inside your dashboard, create one bell per event you want to track.
   For example: **"New Orders"**, **"New Shipments"**, **"New Customers"**.
   You can have one bell for everything if you prefer — but it's worth at
   least separating *operations* (orders, shipments) from *finance*
   (credit memos).
3. Install the PingBell phone app and/or enable browser/desktop
   notifications. That's where the buzzes will arrive.
4. Open your account settings at [app.pingbell.io](https://app.pingbell.io)
   and copy your **API key** — you'll paste it into Magento next.

## 2. Install via Composer

```bash
composer require byte8/module-pingbell
```

## 3. Enable the module

```bash
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:flush
```

## 4. Paste the API key

Go to **Stores → Configuration → Byte8 → PingBell Notifications**.

1. Set **Enable PingBell Notifications** to **Yes**.
2. Paste your **API Key** into the API Key field.
3. Click **Save Config**.

The API key is stored AES-encrypted via Magento's standard
`Magento\Config\Model\Config\Backend\Encrypted` backend model — the raw key
never sits in plaintext in `core_config_data`.

## 5. Pick a bell per event

Scroll to the **Event Notifications** section. Each event row has a
**Fetch Bells** button. For the events you care about:

1. Click **Fetch Bells** — the module calls
   `https://app.pingbell.io/userPingbells` with your saved API key and
   loads your available bells into a dropdown.
2. Select the bell — its ID auto-fills the **PingBell ID** field below.
3. Click **Save Config**.

Leave a PingBell ID empty for any event you don't want notifications for.

## 6. Smoke test

The simplest verification — go to the storefront and place a test order.

Within a couple of seconds:

- Your phone / desktop / watch (whichever has the PingBell app) should
  buzz.
- The bell shows the new ping in your PingBell dashboard.
- `var/log/pingbell.log` records `PingBell notification sent for event: new_order`.

If nothing happens, the [Troubleshooting](/docs/advanced/troubleshooting)
page covers the usual suspects — disabled module, empty PingBell ID,
firewall blocking outbound HTTPS, expired API key.

## What's next

- **[Configure each event individually](/docs/configuration/events)** —
  point Orders at one bell, Refunds at a different one
- **[Logging](/docs/advanced/logging)** — `var/log/pingbell.log` is your
  first stop when something looks off
- **[Extending](/docs/advanced/extending)** — adding a custom event type
  (e.g. notify on `customer_save_commit_after`) is a five-line `di.xml`
  change
