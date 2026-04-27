---
title: New invoice
description: The sales_order_invoice_save_after event — fires when a Magento invoice is created (often equivalent to "money received").
---

# New invoice notifications

The **invoice** is Magento's "this order is paid" signal. For finance
teams and offline-payment workflows it's the more meaningful bell than
"new order".

## The trigger

Magento event: **`sales_order_invoice_save_after`**.

Fires whenever `Magento\Sales\Model\Order\Invoice` is saved — typically
on:

- **Online payment** capture (most gateways auto-invoice on
  authorize-and-capture, e.g. Stripe in default config).
- **Manual invoice** from an admin clicking *Invoice* in
  Sales → Orders.
- **Bank transfer / offline payment** when the merchant marks the
  order as paid.

It does **not** fire on order placement alone — only when an actual
invoice document gets generated. So the order-vs-invoice gap depends on
your payment method config:

| Payment method | When the invoice fires |
|---|---|
| Stripe / Adyen / typical online card (capture) | A few seconds after order placement. |
| PayPal Express (auth + capture) | At capture, which may be days later. |
| Bank transfer | When the admin marks the order as paid. |
| Cash on delivery | Often when shipment is created (config-dependent). |

## Why have a separate bell

Three reasons we see it set up:

1. **Finance team only cares about invoices.** New-order pings are noise
   to them — the invoice is when accounts-receivable gets to update the
   ledger.
2. **Catch authorization-only orders.** If New Order pings but New
   Invoice doesn't ping for a long time, the gateway likely held it in
   auth without capture — worth investigating.
3. **Offline-payment stores.** With bank-transfer-heavy stores, the
   invoice ping is the "the money has actually arrived" signal — far
   more useful than the order ping.

## Where to point it

| Store type | Recommended bell |
|---|---|
| Bank-transfer-heavy / B2B | Owner's phone. The invoice = "they paid". |
| Standard online-card store | A shared **"Finance"** bell with the rest of accounts-receivable. |
| Subscription / recurring | Skip it — too many invoices, you'll drown. Use a daily summary email instead. |

## Log line

```
[2026-04-26T11:14:02+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: 3RXmkj5p1L9w7VqzAB6h
[2026-04-26T11:14:02+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_invoice
```

## Edge cases

**Multiple invoices per order.** A partial-invoice store will fire this
event multiple times for the same order. The bell can't tell them apart
beyond the saved bell title; if that's a problem,
[extend the observer](/docs/advanced/extending) to include the invoice
number in the notification.

**Cancelled invoices.** Invoice cancellation re-saves the invoice and
**will** trigger this event. If that's noise for you, override the
observer with an `if ($invoice->getState() === Invoice::STATE_CANCELED)
return;` short-circuit.
