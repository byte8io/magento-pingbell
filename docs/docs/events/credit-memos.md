---
title: New credit memo
description: The sales_order_creditmemo_save_after event — refunds and credit notes.
---

# New credit memo notifications

A credit memo in Magento is the formal record of a refund or credit note
— the thing your accountant cares about, and the thing your fraud team
keeps an eye on.

## The trigger

Magento event: **`sales_order_creditmemo_save_after`**.

Fires whenever `Magento\Sales\Model\Order\Creditmemo` is saved —
typically when:

- An admin processes a refund from Sales → Orders → *Credit Memo*.
- A returns-management plugin auto-creates a credit memo on RMA
  completion.
- A payment gateway initiates a refund through the API and Magento
  generates a corresponding credit memo.

Both **online** (refund-via-gateway) and **offline** (refund recorded but
processed manually) credit memos fire the event.

## Why have it as a separate bell

Refunds are usually rarer than orders, but each one is more interesting:

1. **Spike detection.** A burst of refunds in a short window can mean
   anything from a faulty product batch to a checkout pricing bug. A
   distinctive sound on a *"Refunds"* bell makes the spike noticeable
   while it's happening.
2. **Fraud / chargeback monitoring.** Refunds initiated via the gateway
   (e.g. cards after a chargeback) auto-create credit memos. A buzz
   gives you minutes to investigate before more pile up.
3. **Customer-service oversight.** If your CS agents have refund
   permissions, a per-refund buzz keeps the supervisor in the loop
   without scrolling the orders grid.

## Where to point it

| Store type | Recommended bell |
|---|---|
| Any store with a finance or fraud watch | A dedicated **"Refunds"** bell — owner + finance subscribe. |
| Stores with high refund volume | Skip — daily report email is healthier than a constant buzz. |

## Log line

```
[2026-04-26T16:08:55+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: 8Hp5xQ7K2nYrA1CdWv4j
[2026-04-26T16:08:55+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_creditmemo
```

## Edge cases

**Partial credit memos.** Each partial refund creates its own credit
memo and fires the event. A 3-line refund of one order will fire 3
times if you process the lines one by one.

**Credit memos with no refund (offline).** If you save a credit memo
purely as a paper-trail record (no money actually moved), this event
still fires. Combined with strict bookkeeping, you might want to
[extend the observer](/docs/advanced/extending) and check
`$creditmemo->getDoTransaction()` to skip the buzz on offline-only
memos.

**Order cancel-with-refund.** Some gateways will issue a refund and
auto-create the credit memo when an order is cancelled. You'll get the
buzz — there's no separate "cancellation" event hook in PingBell.
