---
title: New customer
description: The customer_register_success event — new account signups on the storefront.
---

# New customer notifications

A signal that someone just created a customer account on the storefront.
Useful for B2B stores where every signup is a hand-raise, less useful for
high-volume D2C where it's a stream.

## The trigger

Magento event: **`customer_register_success`**.

Fires only on **frontend storefront** registration — i.e. when a customer
fills in the signup form themselves. Does **not** fire when:

- A guest checkout completes (no account is created — the
  `customer_register_success` event is specifically for the registration
  flow, not the order flow).
- An admin creates a customer record manually from
  Customers → Add New Customer.
- A connector imports customers via API.

So it's specifically a *"a real human just created an account on my
storefront"* event.

## Why have it as a separate bell

It depends entirely on volume:

1. **B2B stores.** Every signup is a sales-call lead. Owner gets a
   buzz, sales-team gets the lead. Worth its weight in gold.
2. **D2C stores at low volume.** First 100 customers feel like an
   event — the buzz is genuinely fun. Wave back.
3. **D2C stores at high volume.** This bell becomes a constant drip.
   Disable it (leave the field blank), or route it to a Slack-bot bell
   you can mute.

The "signal vs noise" inflection point is around ~5 signups/day. Below
that, every buzz is meaningful. Above that, you're better off with a
weekly cohort report.

## Where to point it

| Store type | Recommended bell |
|---|---|
| B2B / wholesale | Owner's phone, plus sales-team bell. The lead is fresh — call them. |
| D2C, < 5 signups/day | A "Welcome" bell shared with the social-media person, who can DM the new customer to say hi. |
| D2C, > 50 signups/day | Skip — leave the PingBell ID empty. |

## Log line

```
[2026-04-26T09:30:11+00:00] byte8_pingbell.INFO: PingBell notification sent for bell ID: 2GwTvFx8PqM3ny7B1hZk
[2026-04-26T09:30:11+00:00] byte8_pingbell.INFO: PingBell notification sent for event: new_customer
```

## Edge cases

**Social login.** If your store integrates with Google / Facebook /
Apple sign-in via a third-party module, *most* of those modules call
`customer_register_success` for first-time logins. Test it once before
relying on it.

**Subscribe-only signups.** Newsletter subscriptions don't create a
customer account, so they don't trigger this event. If you want
notifications about newsletter signups, that needs a separate observer
on `newsletter_subscriber_save_commit_after` — easy to add via the
[Extending](/docs/advanced/extending) pattern.

**B2B account approval workflow.** If your store puts new B2B accounts
into a "pending approval" state, `customer_register_success` still fires
on registration — *not* on approval. For an approval-based ping, you'll
need a custom observer on the workflow's approval event.
