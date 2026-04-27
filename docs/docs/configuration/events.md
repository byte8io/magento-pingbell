---
title: Per-event configuration
description: Routing each Magento event to its own PingBell — the Fetch Bells UI and the underlying config paths.
---

# Per-event configuration

PingBell is **per-event-routable**: the module supports five Magento
events, and each can point at a different PingBell. You don't need to use
all five — leave the PingBell ID empty for any event you don't care about,
and that observer will silently skip.

## The five fields

In **Stores → Configuration → Byte8 → PingBell Notifications → Event Notifications**:

| Field label | Magento event | Config path |
|---|---|---|
| **New Order** | `sales_order_place_after` | `byte8_pingbell/events/new_order_pingbell_id` |
| **New Invoice** | `sales_order_invoice_save_after` | `byte8_pingbell/events/new_invoice_pingbell_id` |
| **New Shipment** | `sales_order_shipment_save_after` | `byte8_pingbell/events/new_shipment_pingbell_id` |
| **New Credit Memo** | `sales_order_creditmemo_save_after` | `byte8_pingbell/events/new_creditmemo_pingbell_id` |
| **New Customer Registration** | `customer_register_success` | `byte8_pingbell/events/new_customer_pingbell_id` |

Each field stores a **PingBell ID** — the `id` query parameter from the
PingBell dashboard URL. For example, if a bell's dashboard URL is
`https://app.pingbell.io/log?id=Ljgkg6if7Tbx6x0n6jiv`, the ID is
`Ljgkg6if7Tbx6x0n6jiv`.

## The Fetch Bells button

You don't have to copy IDs by hand. Each row has a **Fetch Bells** button
that:

1. POSTs the saved API key to the controller at
   `byte8_pingbell/config/fetchBells`.
2. The controller calls `https://app.pingbell.io/userPingbells?api_key=...`.
3. Returns your bells as JSON: `[{ id, name }, …]`.
4. Renders a dropdown next to the button. Pick a bell — its ID drops
   into the PingBell ID input.
5. **Save Config** to persist.

If the call returns no bells, you'll see *"No bells found. Please check
your API key."* — usually means the key is wrong, or you haven't created
any bells yet in your PingBell account.

## Routing patterns we see in the wild

Some real-world setups merchants run:

**Single-owner store, one device.**
One bell for everything. Set all five fields to the same PingBell ID.
You'll get five separate buzzes for one customer journey (order →
invoice → shipment), which can be noisy — usually we recommend reducing
to **just New Order** for this case.

**Owner + dispatch + finance.**
Three bells:

- **"Sales"** → New Order, New Customer.
- **"Dispatch"** → New Invoice, New Shipment.
- **"Finance"** → New Credit Memo.

Each member of staff subscribes only to the bells they care about.

**B2B store, every signup matters.**
Set **only** New Customer. The owner gets a buzz on every new customer
registration so they can call them. Everything else stays quiet.

**Refund-monitoring store.**
Set **only** New Credit Memo, on a "fraud watch" bell shared with finance.
You're not interested in routine sales pings — only when a refund happens.

## Skipping an event

Just leave the PingBell ID blank and **Save Config**. The observer does
this check at the top:

```php
if (!$this->config->isEnabled()) {
    return;
}

$pingBellId = $this->config->getPingBellId($this->eventKey);

if (!$pingBellId) {
    return;
}
```

So an empty ID means **zero work** — no HTTP call, no log line, no
notification.
