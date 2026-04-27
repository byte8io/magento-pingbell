# Byte8 PingBell — Documentation Site

Docusaurus 3 site for [`byte8/module-pingbell`](../README.md).

Hosted at **https://magento-pingbell.byte8.dev**.

## Local development

```bash
cd docs
nvm use            # picks up Node 20+
pnpm install
pnpm start
```

Opens at `http://localhost:3000/`.

## Production build

```bash
pnpm build
```

Output goes to `build/`. Deploy that directory to any static host (the
repo's GitHub Pages workflow handles `magento-pingbell.byte8.dev`).

## Editing

- **Doc pages** live under `docs/docs/` — mirror the sidebar order in
  `sidebars.ts`.
- **Marketing pages** (`/`, `/pricing`) live under `src/pages/` —
  `index.tsx` is the homepage, `pricing.tsx` is the pricing page.
- **Theme overrides** live in `src/css/custom.css` — deep indigo accent
  (`#1f1d51`), matching the pingbell.io brand. Don't edit Docusaurus
  defaults inline; change the variables in the `:root` and
  `[data-theme='dark']` blocks.
- **Blog** = changelog. One markdown file per release under `blog/`,
  authored as `byte8` (see `blog/authors.yml`).
