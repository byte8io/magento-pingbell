import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

interface FeatureCardProps {
  href: string;
  icon: string;
  title: string;
  body: string;
  cta: string;
}

function FeatureCard({ href, icon, title, body, cta }: FeatureCardProps) {
  return (
    <Link to={href} className={styles.featureCard}>
      <span className={styles.featureIcon} aria-hidden>{icon}</span>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureBody}>{body}</p>
      <span className={styles.featureFooter}>{cta} ↘</span>
    </Link>
  );
}

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Byte8 PingBell — Real-time Magento 2 notifications"
      description="Real-time push notifications for Magento 2 — orders, invoices, shipments, credit memos and customer registrations straight to your phone, desktop and watch via PingBell. Free, MIT-licensed."
    >
      <main>
        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Magento 2 · Free · MIT</span>
            <h1 className={styles.heroTitle}>
              Your store ringing,{' '}
              <span className={styles.heroTitleAccent}>before the email even lands.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A real-time bridge from Magento to{' '}
              <Link to="https://pingbell.io">PingBell</Link>. New orders,
              invoices, shipments, refunds and customer signups push to your
              phone, desktop or smartwatch the moment they happen — no email
              delay, no dashboard refresh, no missed sales.
            </p>
            <div className={styles.heroCtas}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
                Get started in 5 minutes
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/">
                Read the docs
              </Link>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statValue}>5</span>
                <span className={styles.statLabel}>Built-in event types</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>5s</span>
                <span className={styles.statLabel}>HTTP timeout — non-blocking</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>AES</span>
                <span className={styles.statLabel}>API key stored encrypted</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>MIT</span>
                <span className={styles.statLabel}>License — free forever</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core capabilities */}
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Core</span>
            <p className={styles.sectionLead}>
              Five Magento events, one bell per event, zero impact on checkout. Set up in five minutes.
            </p>
          </header>

          <div className={styles.cardGrid}>
            <FeatureCard
              href="/docs/events/orders"
              icon="🛒"
              title="Order placed"
              body="Hooks sales_order_place_after — the moment checkout completes. The first ping you'll want, especially for low-volume / high-value stores where every order matters."
              cta="Order events"
            />
            <FeatureCard
              href="/docs/events/invoices"
              icon="🧾"
              title="Invoice & shipment"
              body="Separate bells for sales_order_invoice_save_after and sales_order_shipment_save_after. Useful when finance and dispatch are different humans on different shifts."
              cta="Invoice / shipment events"
            />
            <FeatureCard
              href="/docs/events/credit-memos"
              icon="↩️"
              title="Credit memo"
              body="Refunds and credit memos via sales_order_creditmemo_save_after. Catch returns the moment they're processed — useful for monitoring refund spikes or fraud patterns."
              cta="Credit memo events"
            />
          </div>
        </section>

        {/* Integration */}
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Integration</span>
            <p className={styles.sectionLead}>
              Built for Magento, designed never to get in checkout's way.
            </p>
          </header>

          <div className={styles.cardGrid}>
            <FeatureCard
              href="/docs/configuration/general"
              icon="🔐"
              title="Encrypted API key"
              body="Your PingBell API key lives behind Magento's standard Encrypted backend model. Stored AES-encrypted in core_config_data, decrypted only when an event fires."
              cta="General settings"
            />
            <FeatureCard
              href="/docs/configuration/events"
              icon="🎯"
              title="One bell per event"
              body="Route each Magento event to its own PingBell — Orders to your phone, Customer signups to a Slack-bot bell, Refunds to a finance team bell. Use the Fetch Bells button to load and pick from your account."
              cta="Per-event routing"
            />
            <FeatureCard
              href="/docs/advanced/logging"
              icon="🛡️"
              title="Non-blocking by design"
              body="A 5-second cURL timeout, exception-swallowed observers, dedicated var/log/pingbell.log. If pingbell.io ever goes down, your checkout doesn't even notice."
              cta="Logging & resilience"
            />
          </div>
        </section>

        {/* Why */}
        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Why PingBell</span>
            <p className={styles.sectionLead}>
              Email is slow, dashboards are pull-based, Slack drowns in noise. PingBell is the right shape for "tell me right now."
            </p>
          </header>

          <div className={styles.cardGrid}>
            <FeatureCard
              href="/docs/getting-started/first-notification"
              icon="📱"
              title="Cross-device"
              body="Phone, desktop browser, smartwatch — PingBell hits whichever you're actually looking at. Owners, store managers, dispatch staff and finance can each subscribe to the bells that matter to them."
              cta="First notification"
            />
            <FeatureCard
              href="/docs/events/customers"
              icon="👋"
              title="Customer registrations"
              body="customer_register_success bell for B2B stores where every signup is a sales-call lead, or D2C stores where you want to wave at new fans the same hour they sign up."
              cta="Customer events"
            />
            <FeatureCard
              href="/docs/advanced/extending"
              icon="🧩"
              title="Tiny, hackable codebase"
              body="One observer, one client, one config — under 500 lines of PHP. Add a custom event in minutes by registering an observer that points at a virtualType with a new eventKey."
              cta="Extending"
            />
          </div>
        </section>

        {/* CTA band */}
        <section className={styles.ctaBand}>
          <h2 className={styles.ctaTitle}>Five minutes to a ringing phone.</h2>
          <p className={styles.ctaSubtitle}>
            Composer install, paste an API key, click Fetch Bells. The next order on your store will buzz your pocket.
          </p>
          <div className={styles.heroCtas}>
            <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
              Quick start
            </Link>
            <Link className="button button--secondary button--lg" to="https://github.com/byte8io/magento-pingbell">
              View on GitHub
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
