# Byte8_PingBell — Real-Time Order Notifications for Magento 2

A Magento 2 module that sends real-time notifications to [PingBell](https://pingbell.io) when orders are placed in your store.

Get instant push notifications on your phone, desktop, or smartwatch every time a customer completes an order — no email delays, no dashboard refreshing.

## Features

- Sends a notification to PingBell on every new order
- Encrypted API key storage using Magento's built-in encryption
- "Fetch Bells" button in admin to select from your PingBell accounts
- Dedicated log file (`var/log/pingbell.log`) for easy debugging
- Fully non-blocking — checkout is never affected if the PingBell API is unreachable

## Requirements

- Magento 2.4.x
- PHP 8.1+
- A [PingBell](https://pingbell.io) account and API key

## Installation

### Composer (recommended)

```bash
composer require byte8/module-pingbell
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
```

### Manual

1. Copy the module files to `app/code/Byte8/PingBell/`
2. Run:

```bash
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
```

## Configuration

Navigate to **Stores > Configuration > Byte8 > PingBell Notifications**.

| Field | Description |
|-------|-------------|
| **Enable PingBell Notifications** | Turn notifications on or off |
| **API Key** | Your PingBell API key (stored encrypted) |
| **Fetch Bells** | Click to load your available bells from PingBell |
| **PingBell ID** | The bell to notify — auto-filled when you select from the dropdown, or enter manually |

### Setup steps

1. Set **Enable** to **Yes**
2. Enter your **API Key** from [app.pingbell.io](https://app.pingbell.io)
3. Click **Fetch Bells** and select a bell from the dropdown
4. **Save Config**
5. Place a test order to verify notifications arrive

## How It Works

The module listens to the `sales_order_place_after` event. When a customer completes checkout, the observer sends a POST request to the PingBell API (`https://app.pingbell.io/log`). The entire call is wrapped in a try/catch with a 5-second timeout so it never blocks the checkout flow.

## Logging

All PingBell activity is logged to:

```
var/log/pingbell.log
```

## License

Proprietary — see [LICENSE.txt](LICENSE.txt) for details.
