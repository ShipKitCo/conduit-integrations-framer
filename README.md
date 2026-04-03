# SaaS Integrations Directory — Framer Template

The only standalone integrations directory page template on Framer Marketplace. Live search, category filters, grid/list layout toggle, and 42 mock integrations — all in a single code component. Dark and light mode.

---

## What's Included

| File | Purpose |
|---|---|
| `framer-code-components/IntegrationsDirectory.tsx` | Main component — paste into Framer Code |
| `framer-code-components/FRAMER-SETUP.md` | Step-by-step Framer project setup |
| `ai-prompts/` | 4 AI prompts for customizing integrations, copy, and categories |
| `listing/` | Marketplace listing copy for all platforms |
| `LICENSE.md` | Usage terms |

---

## Setup in Framer (3 Steps)

### Step 1 — Create a new project

Go to [framer.com](https://framer.com) → New project → Blank canvas. Name it: **SaaS Integrations Directory**.

### Step 2 — Add the code component

1. Assets panel → **Code** → **+** (New code file)
2. Name it `IntegrationsDirectory`
3. Paste the full contents of `framer-code-components/IntegrationsDirectory.tsx`
4. Press **Cmd+S**

### Step 3 — Customize via Property Controls

Select the component on canvas. Four controls appear in the right panel:

| Control | Default | What it changes |
|---|---|---|
| **Color Mode** | Dark | Entire template switches dark ↔ light |
| **Accent Color** | `#818CF8` | Category pills, search ring, Docs links, CTA buttons |
| **Product Name** | Conduit | Nav logo text and all product name references |
| **Layout Mode** | Grid | Integration cards: compact 4-col grid or readable list rows |

---

## Sections

1. **Nav** — sticky, blur backdrop, CTA button
2. **Hero** — headline, subhead, search input, stat strip, logo marquee
3. **Featured Integrations** — 6 highlighted cards with brand logos (3-col grid)
4. **Marketplace** — all 42 integrations, live search + category filter, grid/list toggle, dynamic result count
5. **Build Your Own** — Webhooks API CTA, open centered layout
6. **Footer**

---

## Customizing Content

All content lives in data arrays at the top of `IntegrationsDirectory.tsx`. Key areas:

| What to change | Where to find it |
|---|---|
| Integration names, descriptions | `INTEGRATIONS` array at top of component |
| Category names | `CATEGORIES` array |
| Hero headline + search placeholder | Copy strings near top of component |
| Featured integrations | Set `featured: true` on any entry in `INTEGRATIONS` |

Use the prompts in `ai-prompts/` to regenerate any of this content with an LLM in minutes.

---

## Browser Support

| Browser | Notes |
|---|---|
| Chrome 90+ | Full support |
| Safari 14+ | Full support (backdrop-filter supported) |
| Firefox 88+ | Full support |
| Mobile Safari iOS 14+ | Full support |

Scroll-reveal animations respect `prefers-reduced-motion`.

---

## Purchase

Available on Gumroad: [https://shipkitco.gumroad.com/l/conduit-integrations-framer](https://shipkitco.gumroad.com/l/conduit-integrations-framer)

Also available on Framer Marketplace and Creative Market.

---

## Support

Questions not covered here: open an issue or contact via the marketplace listing. Response within 48 hours.

GitHub: [https://github.com/ShipKitCo/conduit-integrations-framer](https://github.com/ShipKitCo/conduit-integrations-framer)
