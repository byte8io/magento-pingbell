import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting started',
      collapsed: false,
      items: [
        'getting-started/quick-start',
        'getting-started/installation',
        'getting-started/first-notification',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/general',
        'configuration/events',
      ],
    },
    {
      type: 'category',
      label: 'Events',
      items: [
        'events/orders',
        'events/invoices',
        'events/shipments',
        'events/credit-memos',
        'events/customers',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/logging',
        'advanced/troubleshooting',
        'advanced/extending',
      ],
    },
  ],
};

export default sidebars;
