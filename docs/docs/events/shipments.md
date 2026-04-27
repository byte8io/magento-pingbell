---
title: New shipment
description: The sales_order_shipment_save_after event — fires when goods are dispatched.
---

# New shipment notifications

A shipment is created when goods physically (or digitally) leave the
warehouse. For dispatch-heavy stores, this is the operations team's
favourite bell.

## The trigger

Magento event: **`sales_order_shipment_save_after`**.

Fires whenever `Magento\Sales\Model\Order\Shipment` is saved — typically
when:

- An admin clicks *Ship* in Sales → Orders and saves the shipment.
- A WMS connector creates the shipment via API after a pick is complete.
- A third-party fulfilment integration (ShipperHQ, ShipStation, Sendcloud)
  creates the shipment for you.

The shipment can be created automatically by some connectors before the
courier has actually collected — so this is "shipment record created"
rather than "parcel left the building". Close enough for most use cases.

## Why have it as a separate bell

Three patterns we see:

1. **Dispatch supervisor.** Wants a buzz every time a shipment is
   created so they can verify it on the dashboard before the courier
   pickup window.
2. **Customer-service team.** Pre-empts "where's my order?" tickets —
   if customer-service knows shipments are flowing on schedule, they
   answer support faster.
3. **Owner-operator stores.** The owner picks, packs and ships
   themselves. The shipment ping is the "I just sent that one" record,
   useful when stepping away from the laptop.

## Where to point it

| Store type | Recommended bell |
|---|---|
| Owner-operator | Skip it — you just clicked *Ship*, you don't need a notification about it. |
| Single-warehouse multi-staff | A shared **"Dispatch"** bell. Helps cross-cover during busy periods. |
| Multi-warehouse / 3PL | This bell may be misleading — a 3PL connector saving the shipment isn't the same as goods leaving. Pair with the 3PL's own webhooks. |

## Log line

```
[2026-04-26T15:42:18+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: 7FzcBkw9NpQrx1vMo2Lj
[2026-04-26T15:42:18+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_shipment
```

## Edge cases

**Tracking number added later.** Saving a shipment to add a tracking
number re-fires this event. To suppress that, see the
[Extending](/docs/advanced/extending) page — you can early-return on
`!$shipment->isObjectNew()`.

**Multi-shipment orders.** Each shipment fires its own ping. Useful for
partial-dispatch workflows; noisy for stores that ship one order in
3-5 parts.

**Drop-ship orders.** If your storefront uses drop-shipping with a
plugin that creates the shipment record but a different supplier
actually ships, the bell fires when *the record is saved*, not when
the supplier actually dispatches. That's an architectural mismatch —
think twice before relying on this for SLA monitoring.
