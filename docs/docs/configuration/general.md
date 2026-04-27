---
title: General settings
description: The Stores → Configuration → Byte8 → PingBell Notifications tree — master switch and API key.
---

# General configuration

All PingBell settings live at **Stores → Configuration → Byte8 → PingBell
Notifications**. The section is **website-default-only** — the module is
not store-view scoped, since pinging "the same humans" regardless of which
storefront the order came through is almost always what you want.

## General

| Field | Default | Notes |
|---|---|---|
| **Enable PingBell Notifications** | No | Master switch. When disabled, every observer short-circuits before making any HTTP call. |
| **API Key** | empty | Your pingbell.io API key. Stored AES-encrypted via Magento's `Magento\Config\Model\Config\Backend\Encrypted` backend model. |

## How the master switch behaves

When **Enable PingBell Notifications** is set to **No**:

- Every event observer (orders, invoices, shipments, credit memos,
  customers) early-returns before touching the HTTP client.
- The **Fetch Bells** buttons in the Events section still work — they
  fetch bells from PingBell using the saved API key, regardless of the
  master switch. This lets you set bell IDs in advance, then flip the
  master switch on later.
- Nothing is queued — disabling and re-enabling does **not** flush a
  backlog of unsent notifications.

## How the API key is stored

The field is declared in `etc/adminhtml/system.xml` as:

```xml
<field id="api_key" type="obscure">
    <label>API Key</label>
    <backend_model>Magento\Config\Model\Config\Backend\Encrypted</backend_model>
</field>
```

Practically that means:

1. The raw key is encrypted with Magento's `crypt_key` from
   `app/etc/env.php` before going into `core_config_data`.
2. The admin form shows `******` instead of the saved value, even when
   editing — you don't see the key in plaintext on the form.
3. `Byte8\PingBell\Model\Config::getApiKey()` decrypts the value at
   runtime, only on demand when an event fires or when **Fetch Bells**
   is clicked.

If you rotate `app/etc/env.php` (i.e. the encryption key changes), the
saved API key becomes unreadable and you'll need to paste it again.

## Fetch Bells while the API key field is masked

If you click **Fetch Bells** when the API key field is showing the masked
`******` placeholder, the controller falls back to the saved (decrypted)
key automatically — see
[`Controller/Adminhtml/Config/FetchBells.php`](https://github.com/byte8io/magento-pingbell/blob/main/Controller/Adminhtml/Config/FetchBells.php).
You don't have to clear and re-paste the key just to fetch bells.

## Where the per-event settings live

The five PingBell ID fields each live one level down in the same section
— see [Event configuration](/docs/configuration/events).
