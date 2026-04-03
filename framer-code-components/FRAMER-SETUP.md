# Framer Setup Guide — saas-integrations-directory-v1

**Component:** `IntegrationsDirectory.tsx`
**Product name used in demo:** Conduit
**Framer type:** Code Component (single file, no dependencies)

---

## 1. Quick Setup (3 steps)

1. Open `IntegrationsDirectory.tsx` → select all → copy
2. In Framer: open the **Assets** panel → **Code** tab → click **+ New file** → paste → Save
3. Drag the `IntegrationsDirectory` component onto the canvas → set Width to **Fill** in the layout panel → open the **Properties** panel on the right to configure controls

That's it. The component renders the full page: nav, hero, search, category filter, integration grid/list, featured section, Build Your Own CTA, and footer.

---

## 2. Property Controls

All controls appear in the Framer Properties panel when the component is selected on canvas.

### Color Mode
- **Type:** Enum — `dark` / `light`
- **Default:** `dark`
- Switches the full token set between dark and light mode. Both modes use the same `#818CF8` indigo accent.

### Accent Color
- **Type:** Color picker (any hex)
- **Default:** `#818CF8` (indigo)
- Propagates to every interactive element in one edit:
  - Active category filter pills
  - "Docs →" inline links
  - Featured integration card border highlight (top inset accent stripe)
  - Build Your Own section CTA buttons
  - Search input focus ring

### Product Name
- **Type:** String
- **Default:** `"Conduit"`
- Updates: nav logo text, hero headline, hero subhead, footer copyright, and all internal copy that references the product name. Change this once to rebrand the entire page.

### Layout Mode
- **Type:** Enum — `grid` / `list`
- **Default:** `grid`
- **Grid:** Compact 4-column card layout. Each card shows the logo circle, name, category tag, and a truncated one-line description. Best for directories with 20+ integrations.
- **List:** Full-width rows. Each row shows the logo circle, name, category, and the complete description. Best for directories where description copy is a selling point.
- Both modes support live search and category filter simultaneously.

> Note: search and filter state is React state — it works correctly in **Preview** mode and on published Framer sites. In the canvas editor itself, filtering is not visible. Use Preview (Cmd+P) to QA all interactions.

---

## 3. Customizing Integration Data

The full integration list lives in the `INTEGRATIONS` constant at the top of the file, before the component function. It is a plain TypeScript array — no external data fetching, no CMS dependency.

### Shape of one entry

```typescript
{
  name: "Your Tool",
  category: "CRM",
  description: "One sentence description.",
  initials: "YT",
  colorIdx: 0,
  featured: true,   // optional — omit or set false for non-featured
}
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| `name` | string | Display name shown on the card |
| `category` | string | Must match one of the strings in `CATEGORIES` exactly (case-sensitive) |
| `description` | string | One sentence. Engineering-voice. Appears in list mode and on hover in grid mode. |
| `initials` | string | 2 characters shown in the logo circle when no image is used |
| `colorIdx` | 0–7 | Cycles through 8 built-in circle background colors. Use `colorIdx % 8` for long lists. |
| `featured` | boolean | `true` makes the entry appear in the "Popular integrations" section. Recommend 6–12 featured entries. |

### The 7 default categories

1. CRM
2. Analytics
3. Communication
4. Storage
5. Payments
6. Developer Tools
7. Marketing

These match the `CATEGORIES` array. See section 5 for how to rename or reorder them.

### colorIdx color reference

`colorIdx` maps to 8 background colors for the logo initials circles. They cycle automatically — just increment from 0 to 7 and repeat for large lists. The colors are defined in the `CIRCLE_COLORS` array inside the component and are designed to work in both dark and light mode.

---

## 4. Replacing Logo Circles with Real Logos

By default, each integration card renders a colored CSS `div` containing 2-letter initials. This requires no image assets.

**To use a real logo image**, edit the TSX directly. Find the logo circle render block (search for `CIRCLE_COLORS` or `logoCircle`) and replace the `div` with an `img` tag:

```tsx
// Before (initials circle):
<div style={{ background: CIRCLE_COLORS[colorIdx], ... }}>
  {initials}
</div>

// After (real logo):
<img
  src="https://your-cdn.com/logos/your-tool.svg"
  alt={name}
  style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain" }}
/>
```

You can also supply logos per-entry by adding a `logoUrl` field to the `INTEGRATIONS` entries and updating the render block to check for `entry.logoUrl` before falling back to the initials circle. This is the recommended pattern for production use.

Framer does not currently support CSS overrides on inner elements of Code Components from the canvas, so TSX edits are required for logo images.

---

## 5. Adding or Removing Categories

The category filter strip is driven by the `CATEGORIES` array, which lives near the top of the file just below `INTEGRATIONS`:

```typescript
const CATEGORIES = [
  "All",
  "CRM",
  "Analytics",
  "Communication",
  "Storage",
  "Payments",
  "Developer Tools",
  "Marketing",
]
```

- `"All"` must stay as the first entry — it is the default selected state.
- Add a new category by appending a string: `"EHR"`, `"Data Warehouse"`, etc.
- Remove a category by deleting its string from the array.
- After changing `CATEGORIES`, update the `category` field on affected `INTEGRATIONS` entries to match the new string exactly. Category matching is case-sensitive.

---

## 6. Customizing Colors

**Accent color:** Use the Property Control (section 2). This is the recommended path — it propagates to every accent use in one edit.

**Deeper token changes:** The full token object is defined in the `T` constant at the top of the component function, after the props are destructured. It reads like this:

```typescript
const T = {
  bg:       colorMode === "dark" ? "#0D0D0D" : "#F8F8FC",
  surface:  colorMode === "dark" ? "#141414" : "#FFFFFF",
  elevated: colorMode === "dark" ? "#1C1C1E" : "#F0F0F8",
  border:   colorMode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
  // ...
}
```

Edit values in `T` to change any individual token without touching the rest of the component.

---

## 7. Framer Variable Names

These variable names match across all templates in the ShipKit bundle. If you are using multiple templates together, define these variables once in Framer and reference them across all pages.

| Framer Variable | Token role |
|---|---|
| `Color/Accent` | Accent color — indigo `#818CF8` by default |
| `Color/Background` | Page background — `#0D0D0D` dark / `#F8F8FC` light |
| `Color/Surface` | Card backgrounds — `#141414` dark / `#FFFFFF` light |
| `Color/Border` | Default border — `rgba(255,255,255,0.10)` dark / `rgba(0,0,0,0.08)` light |
| `Color/Text` | Primary text — `#F5F5F5` dark / `#0D0D0D` light |
| `Color/Muted` | Secondary/muted text — `#A3A3A3` dark / `#6B6B6B` light |

These names are intentionally short. Framer's variable picker shows them in a flat list — shorter names scan faster.

---

## 8. Publishing to Framer

1. **Name your Framer project before first publish.** The project name becomes part of the published URL and cannot be changed after the first publish.
   - Suggested format: `Conduit Integrations — [Your Brand]` (replace "Conduit" with your product name)

2. **Publish the site:** File → Publish → Publish

3. **Get your Remix Link:** File → Share → Copy Remix Link
   - This is the URL buyers use to clone your template into their own Framer account
   - Paste this link into your Framer Marketplace submission as the **"Checkout URL source"** field

4. **Framer Marketplace submission checklist:**
   - Title ≤ 80 characters
   - 3 preview images (1440×960 recommended; use your published site screenshots)
   - Remix Link pasted in the submission form
   - Category: select "Page" or "Section" depending on submission guidelines at time of submit

---

## 9. Known Limitations

- **Search and category filter are React state.** They work correctly in Framer Preview (Cmd+P) and on published Framer sites. Inside the canvas editor, the component renders in its default state (all integrations visible, no active filter). Always use Preview to verify filter behavior.

- **Logo circles are CSS-only.** Real logo images require editing the TSX to replace the initials `div` with an `img` tag. This cannot be done from the Framer canvas UI.

- **Single-file architecture.** The entire page — nav, hero, grid, CTA, footer — is one Code Component. This keeps setup to a single paste step but means Framer's layer panel will show one component rather than individual sections. Use the Property Controls and TSX edits (not Framer layers) to customize.

- **Font loading.** The component imports Geist and Geist Mono via Google Fonts CDN inside a `<style>` tag. On first load in Preview there may be a brief flash of fallback font while Geist loads. This is a CDN latency issue, not a bug.
