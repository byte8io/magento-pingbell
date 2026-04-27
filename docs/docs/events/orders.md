---
title: New order
description: The sales_order_place_after event — fires the moment Magento commits a new order.
---

# New order notifications

The "New Order" bell is the one most stores set up first — and often the
only one they need.

## The trigger

Magento event: **`sales_order_place_after`**.

Fires immediately after `Magento\Sales\Model\OrderManagement::place()`
commits the order to the database — i.e. the moment the customer-facing
"Order placed" message renders, regardless of payment status. Includes
both online (Stripe, PayPal) and offline (bank transfer, COD) checkouts.

## What gets sent

The PingBell call is **fire-only**. The current module sends a `POST` to
`https://app.pingbell.io/log?id=YOUR_BELL_ID` with no body — PingBell's
own dashboard renders the bell's saved title (e.g. *"New Magento order"*)
as the notification text on your device.

If you want a richer payload (order number, total, customer name in the
notification body), see the [Extending](/docs/advanced/extending) page —
the `PingBellClient::sendNotification()` method is small enough to wrap
or replace cleanly.

## Where to point it

A few patterns:

| Store type | Recommended bell |
|---|---|
| Single-owner D2C | The owner's personal phone. *"Cha-ching"-style instant feedback*. |
| Multi-staff store | A shared **"Sales"** bell that the whole team subscribes to. |
| High-volume store | Don't use this. The buzz becomes noise above ~50 orders/day; pick a different event (e.g. credit memo or first-time customer). |

## What it looks like in the log

```
[2026-04-26T10:21:33+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: Ljgkg6if7Tbx6x0n6jiv
[2026-04-26T10:21:33+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_order
```

## Edge cases

**Multi-store / multi-website.**
The observer fires for **every** store view. There's no per-store
filtering — if you sell on three storefronts, all three new-order events
hit the same bell. Use the [Extending](/docs/advanced/extending) pattern
to add per-store routing.

**Order placed via API / B2B.**
`sales_order_place_after` fires the same way for orders created via the
Magento REST/GraphQL APIs, third-party connectors, or admin "Create New
Order". You'll get a buzz for those too.

**Order cancellation.**
This event does **not** fire on order cancel — only on the original
place. There's no built-in cancel hook in PingBell. If you need it, add
a custom observer for `sales_order_save_commit_after` and check
`getOrigData('state') === 'pending' && getData('state') === 'canceled'`.

**Failed payment.**
Magento still calls `sales_order_place_after` *before* the payment
authorization fails on some gateways. The notification fires; the order
ends up in `pending_payment` or `payment_review`. Don't use this bell as
your finance-side "money in the bank" signal — use **New Invoice**
instead.
