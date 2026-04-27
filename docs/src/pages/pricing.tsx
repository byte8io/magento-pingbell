import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Pricing(): React.ReactElement {
  return (
    <Layout
      title="Pricing — Byte8 PingBell"
      description="Free forever. Byte8 PingBell is MIT-licensed on GitHub and Composer. The only thing you pay for is your PingBell account at pingbell.io — see their pricing for tiers."
    >
      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Pricing</span>
            <h1 className={styles.heroTitle}>
              Free. <span className={styles.heroTitleAccent}>Forever.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              The Byte8 PingBell module is MIT-licensed on GitHub + Composer.
              No expiring trial, no feature gating, no upsell. The only thing
              you pay for is the{' '}
              <Link to="https://pingbell.io">PingBell account</Link> — see
              pingbell.io for their tiers. The Magento bridge itself is, and
              will stay, free.
            </p>
            <div className={styles.heroCtas}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/quick-start">
                Install the module
              </Link>
              <Link className="button button--secondary button--lg" to="https://pingbell.io">
                See PingBell.io pricing
              </Link>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statValue}>€0</span>
                <span className={styles.statLabel}>The Magento module — MIT</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>5</span>
                <span className={styles.statLabel}>Built-in event types</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Per-notification charge from us</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>∞</span>
                <span className={styles.statLabel}>Stores per licence</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>What's included</span>
            <p className={styles.sectionLead}>
              Everything you'd expect a "free" Magento module to <em>not</em> do — bundled in.
            </p>
          </header>

          <ul style={{ lineHeight: 1.8, color: 'var(--ifm-color-emphasis-700)' }}>
            <li><strong>All five built-in event types</strong> — orders, invoices, shipments, credit memos, customer registrations. No "Pro" tier with the useful ones gated.</li>
            <li><strong>Per-event PingBell routing</strong> — every event can point at a different bell. Different bells for owner / dispatch / finance is a feature, not an upsell.</li>
            <li><strong>Encrypted credentials</strong> — API key stored AES-encrypted via Magento's standard Encrypted backend model.</li>
            <li><strong>Dedicated log file</strong> — <code>var/log/pingbell.log</code> for clean separation from <code>system.log</code>.</li>
            <li><strong>Non-blocking observers</strong> — 5-second cURL timeout and try/catch wrapper means a downed PingBell API can never break your checkout.</li>
            <li><strong>Multi-store</strong> — install once, use across as many Magento store views as you run.</li>
          </ul>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-600)' }}>
            Need a paid <strong>Byte8 Pro Service Support Plan</strong>? See the{' '}
            <Link to="https://byte8.io">byte8.io</Link> homepage. The plan covers
            installation, custom event integration and same-day patch turnaround
            across the whole Byte8 module catalogue (PingBell, Stock Radar, VAT
            Validator, SEO Suite).
          </p>
        </section>
      </main>
    </Layout>
  );
}
