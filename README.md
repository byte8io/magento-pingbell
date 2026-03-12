# Byte8_PingBell — Real-Time Notifications for Magento 2

A Magento 2 module that sends real-time notifications to [PingBell](https://pingbell.io) for key store events — new orders, invoices, shipments, credit memos, and customer registrations.

Get instant push notifications on your phone, desktop, or smartwatch — no email delays, no dashboard refreshing.

## Features

- Notifications for multiple events: orders, invoices, shipments, credit memos, and customer registrations
- Each event can notify a different PingBell
- Encrypted API key storage using Magento's built-in encryption
- "Fetch Bells" button per event to select from your PingBell accounts
- Dedicated log file (`var/log/pingbell.log`) for easy debugging
- Fully non-blocking — checkout and other flows are never affected if the PingBell API is unreachable

## Requirements

- Magento 2.4.x
- PHP 8.1+
- A [PingBell](https://pingbell.io) account and API key

## Setting Up Your PingBell Account

1. Go to [pingbell.io](https://pingbell.io) and create an account
2. Once logged in, create a bell for each event you want to track (e.g. "New Orders", "Shipments", "New Customers")
3. To find your **API Key**, go to your account settings at [app.pingbell.io](https://app.pingbell.io)
4. To find a bell's **PingBell ID**, open the bell in your dashboard — the ID is the `id` parameter in the URL, e.g. `https://app.pingbell.io/log?id=Ljgkg6if7Tbx6x0n6jiv` → the ID is `Ljgkg6if7Tbx6x0n6jiv`
5. Install the PingBell app on your phone or enable browser/desktop notifications to receive alerts

## Installation

### Composer (recommended)

```bash
composer require byte8/module-pingbell
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
bin/magento cache:flush
```

### Manual

1. Copy the module files to `app/code/Byte8/PingBell/`
2. Run:

```bash
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
bin/magento cache:flush
```

## Configuration

Navigate to **Stores > Configuration > Byte8 > PingBell Notifications**.

### General Settings

| Field | Description |
|-------|-------------|
| **Enable PingBell Notifications** | Turn the module on or off |
| **API Key** | Your PingBell API key (stored encrypted) |

### Event Notifications

Each event has its own **Fetch Bells** button and **PingBell ID** field. Leave the PingBell ID empty to skip notifications for that event.

| Event | Magento Trigger | Description |
|-------|----------------|-------------|
| **New Order** | `sales_order_place_after` | Customer completes checkout |
| **New Invoice** | `sales_order_invoice_save_after` | Invoice is created |
| **New Shipment** | `sales_order_shipment_save_after` | Shipment is created |
| **New Credit Memo** | `sales_order_creditmemo_save_after` | Credit memo is created |
| **New Customer** | `customer_register_success` | New customer registers |

### Setup Steps

1. Set **Enable PingBell Notifications** to **Yes**
2. Enter your **API Key** from [app.pingbell.io](https://app.pingbell.io) and **Save Config**
3. Scroll to the **Event Notifications** section
4. For each event you want to monitor:
   - Click **Fetch Bells** to load your available bells
   - Select a bell from the dropdown (this auto-fills the PingBell ID field), or paste the ID manually
5. **Save Config**
6. Place a test order (or trigger the relevant event) to verify notifications arrive

## Logging

All PingBell activity is logged to:

```
var/log/pingbell.log
```

## License

Proprietary — see [LICENSE.txt](LICENSE.txt) for details.
