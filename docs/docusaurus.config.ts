import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Byte8 PingBell',
  tagline: 'Real-time Magento 2 notifications — orders, invoices, shipments straight to your phone, desktop and watch',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // Production URL — served under unified docs domain (Cloudflare Pages + Worker router).
  // See apps/docs-router in the byte8.io monorepo + docs/DOCS_SITE_MIGRATION.md.
  url: 'https://docs.byte8.io',
  baseUrl: '/pingbell/',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl:
            'https://github.com/byte8io/magento-pingbell/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Changelog & updates',
          blogDescription: 'Release notes for Byte8 PingBell',
          postsPerPage: 10,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/byte8io/magento-pingbell/edit/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Byte8',
      logo: {
        alt: 'Byte8 PingBell',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        { to: '/blog', label: 'Changelog', position: 'left' },
        { to: '/pricing', label: 'Pricing', position: 'left' },
        {
          href: 'https://github.com/byte8io/magento-pingbell',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://pingbell.io',
          label: 'Get PingBell',
          position: 'right',
          className: 'navbar-cta-button',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'Byte8',
        src: 'img/logo.svg',
        href: 'https://byte8.io',
        width: 32,
        height: 32,
      },
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Quick start', to: '/docs/getting-started/quick-start' },
            { label: 'Configuration', to: '/docs/configuration/general' },
            { label: 'Events', to: '/docs/events/orders' },
            { label: 'Logging', to: '/docs/advanced/logging' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Changelog', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/byte8io/magento-pingbell' },
            { label: 'PingBell.io', href: 'https://pingbell.io' },
          ],
        },
        {
          title: 'Byte8',
          items: [
            { label: 'byte8.io', href: 'https://byte8.io' },
            { label: 'Stock Radar', href: 'https://magento-stock-radar.byte8.dev' },
            { label: 'VAT Validator', href: 'https://magento-vat-validator.byte8.dev' },
            { label: 'Contact', href: 'mailto:helo@byte8.io' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Byte8 Ltd. MIT licensed.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['php', 'bash', 'json', 'xml-doc', 'tsx', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
