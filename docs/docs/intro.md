---
sidebar_position: 1
slug: /
title: Introduction
description: Byte8 PingBell — real-time push notifications for Magento 2 events to your phone, desktop and watch via PingBell.
---

# Byte8 PingBell

A free, MIT-licensed Magento 2 module that bridges five core store events into
[PingBell](https://pingbell.io), so your phone (or desktop, or watch) buzzes
the moment something matters happens — without waiting for a transactional
email or refreshing the admin dashboard.

## What it sends

Out of the box, every one of these Magento events can fire a PingBell notification:

| Event | Magento trigger |
|---|---|
| **New order** | `sales_order_place_after` |
| **New invoice** | `sales_order_invoice_save_after` |
| **New shipment** | `sales_order_shipment_save_after` |
| **New credit memo** | `sales_order_creditmemo_save_after` |
| **New customer registration** | `customer_register_success` |

Each event routes to its **own PingBell ID**, so you can split: orders to your
phone, refunds to a finance team bell, customer signups to a Slack-bridged
bell. Leave a PingBell ID empty and that event is silently skipped — it's not
a binary on/off for the whole module.

## Why this exists

Magento has had transactional email for fifteen years. It works fine if your
operations team checks email. It does not work for:

- **Low-volume / high-value stores** — if every order is the difference
  between a quiet afternoon and a busy one, you want to *know* about it
  inside ten seconds, not wait for SMTP and Outlook's junk filter.
- **Phone-first owners** — the merchant who's on the warehouse floor, on
  the road, or doing photography. They don't sit refreshing Magento admin.
- **Dispatch / finance / customer-service split** — where the same human
  shouldn't get every notification, and email-rule routing is fragile.
- **Smartwatch users** — a buzz on the wrist beats a dashboard tab every time.

PingBell is the right shape for this — push-based, multi-device, low-noise.
This module is the bridge.

## Why this is *not*

- **Not a replacement for transactional email.** Customers still get
  invoices, dispatch confirmations and refund emails as Magento normally
  sends them. PingBell is for *staff*, not buyers.
- **Not a marketing tool.** No drip campaigns, no abandoned-cart funnels.
  Operational notifications only — five event types.
- **Not a queue.** Each event triggers one HTTP request to pingbell.io with
  a 5-second timeout. If pingbell.io is down, the notification is lost — but
  the underlying Magento checkout / invoice / refund still completes
  perfectly. No silent retries, no DB queue, no extra moving parts.

## Where to start

If you've never installed the module, head to the
[Quick start](/docs/getting-started/quick-start) — Composer install, paste
an API key, click Fetch Bells, place a test order.

If you're integrating into an **existing PingBell account** with several
bells already configured, the
[per-event configuration page](/docs/configuration/events) shows how the
**Fetch Bells** button auto-populates your IDs.

If you're a developer planning to **add a custom event** (e.g. fire a
PingBell when a `customer_save_commit_after` happens), the
[Extending](/docs/advanced/extending) page walks through the virtualType
pattern — it's a single new entry in `di.xml` plus an event observer.

## License & support

MIT. Free forever. The codebase is intentionally tiny (one observer, one
HTTP client, one config — under 500 lines of PHP) so it's easy to read,
audit and extend. Issues and PRs welcome on
[GitHub](https://github.com/byte8io/magento-pingbell).
