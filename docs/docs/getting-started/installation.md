---
title: Installation
description: Detailed Composer installation, system requirements, post-install verification, and manual install fallback.
---

# Installation

## Requirements

| Component | Minimum | Notes |
|---|---|---|
| Magento | 2.4.x | Open Source or Adobe Commerce |
| PHP | 8.1 | 8.2 / 8.3 / 8.4 / 8.5 supported |
| Outbound HTTPS | yes | Module talks to `app.pingbell.io` |
| PingBell account | yes | Free tier is enough — see [pingbell.io](https://pingbell.io) |

Beyond a working Magento install, the only external dependency is being
able to make outbound HTTPS calls to **`app.pingbell.io`**. Many production
hosts firewall outbound traffic — if yours does, you'll need to whitelist
that hostname.

## Install via Composer (recommended)

```bash
composer require byte8/module-pingbell
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:flush
```

The package depends on `byte8/module-core`, which is pulled in
automatically.

## Manual install (fallback)

If Composer isn't an option (offline servers, custom build pipelines):

1. Copy the module into `app/code/Byte8/PingBell/` so the directory tree
   matches the repository layout.
2. Make sure `byte8/module-core` is also installed — PingBell sequences
   after it.
3. Then:

```bash
bin/magento module:enable Byte8_PingBell
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:flush
```

## Post-install verification

Module is registered:

```bash
bin/magento module:status Byte8_PingBell
# Module is enabled
```

Configuration section is visible:

> **Stores → Configuration → Byte8 → PingBell Notifications**

If you don't see the **Byte8** tab in Stores → Configuration, the most
common cause is that `byte8/module-core` isn't installed or enabled —
that module is what registers the **Byte8** tab in the admin config tree.

Logging works:

```bash
ls -la var/log/pingbell.log
# File doesn't exist yet — created on the first event fire.
# After a test order, you should see:
# tail -n 5 var/log/pingbell.log
```

## Uninstall

```bash
bin/magento module:disable Byte8_PingBell
composer remove byte8/module-pingbell
bin/magento setup:upgrade
bin/magento cache:flush
```

PingBell stores no database tables of its own — only `core_config_data`
rows under the `byte8_pingbell/*` paths. You can clean those up with:

```sql
DELETE FROM core_config_data WHERE path LIKE 'byte8_pingbell/%';
```

…or just leave them, since they'll be ignored once the module is gone.
