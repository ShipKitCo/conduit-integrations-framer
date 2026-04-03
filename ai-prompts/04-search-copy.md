# AI Prompt 04 — Customize Hero and Marketing Copy

Use this prompt to rewrite all user-facing copy on the page: the hero section, search input, stat strip, and the Build Your Own CTA section.

Run this after you have finalized your integration list and category structure. The copy should reflect your actual integration count, your real audience, and your product's specific voice.

---

## Prompt

```
I am customizing a SaaS integrations directory page template. I need you to write updated copy for the hero section and the "Build Your Own" CTA section of the page.

My product information:

- Product name: [YOUR_PRODUCT_NAME]
- Tagline: [YOUR_TAGLINE]
- Integration count: [YOUR_INTEGRATION_COUNT]
- Category count: [YOUR_CATEGORY_COUNT] (number of category filter tags, not counting "All")
- Target audience: [YOUR_TARGET_AUDIENCE] (be specific — e.g. "backend engineers at B2B SaaS companies", "growth engineers at consumer apps")
- Primary value proposition: [PRIMARY_VALUE_PROP] (what does a developer gain from using these integrations? e.g. "they can sync customer data without writing custom ETL", "they can trigger workflows from product events without maintaining webhooks")
- Tone: precise, engineering-friendly, direct. No exclamation marks. No superlatives. No "powerful" or "seamless" or "robust." Write like a senior engineer explaining something, not like a marketer selling something.

Write updated copy for the following 8 elements. Label each one clearly.

---

1. HERO_H1
The main headline. Requirements:
- Under 12 words
- References the integration count or the breadth of the directory
- Sounds like something a developer would actually say, not a tagline
- Do not start with the product name
- Examples of good H1s: "Connect to 200+ tools without writing custom sync code." / "Every integration your team uses, pre-built and maintained."

2. HERO_SUBHEAD
One sentence below the H1. Requirements:
- Under 22 words
- Explains the specific technical benefit — what does using these integrations save the developer from having to do themselves?
- No "seamless," "powerful," "robust," "best-in-class"

3. SEARCH_PLACEHOLDER
Placeholder text inside the search input. Requirements:
- Under 8 words
- Should feel like a realistic search query, not a label
- Example: "Search 200+ integrations..." or "Find your tools..."

4. STAT_STRIP
Three stats shown below the search input. Each stat has a VALUE and a LABEL.
- STAT_1: should be the integration count. Value: "[YOUR_INTEGRATION_COUNT]+" Label: "integrations"
- STAT_2: should reflect the category count or another structural fact. Suggest the best option.
- STAT_3: suggest a third stat that would be credible and specific to my product. Options: average setup time, API calls per month, number of customers using integrations, number of supported event types, etc. Pick the most compelling one for my audience and write both the value and the label. If you don't know the real number, write a placeholder like "[X]" with a note explaining what to fill in.

5. BUILD_YOUR_OWN_HEADLINE
Section headline for the "Build Your Own" integration CTA at the bottom of the page. Requirements:
- Under 8 words
- Signals that buyers can extend beyond the pre-built list
- Engineering-voice

6. BUILD_YOUR_OWN_BODY
2–3 sentences below the Build Your Own headline. Requirements:
- Explains what the buyer needs to build a custom integration (SDK, API, webhook endpoint, etc.) — use [YOUR_PRODUCT_NAME]'s actual developer tools if you know them, otherwise use placeholders
- Mention a specific technical touch point (e.g. "REST API", "event schema", "webhook payload")
- Under 40 words total across all sentences

7. CTA_PRIMARY_BUTTON
Text for the primary CTA button in the Build Your Own section. Requirements:
- Under 5 words
- Action verb first
- Specific to developer onboarding — not generic "Get started"
- Examples: "Read the API docs" / "View integration SDK" / "Clone the starter repo"

8. CTA_SECONDARY_BUTTON
Text for the secondary CTA button. Requirements:
- Under 5 words
- Lower commitment than primary — something like viewing examples or joining a community
- Examples: "See example integrations" / "Join the developer community" / "Browse the schema"

---

Output format:
Output each element on its own labeled line, in order. No additional commentary between items. No code fence. Ready to paste directly into the component.

After all 8 elements, add a single paragraph of optional notes — things I should consider adjusting based on my audience or product type.
```

---

## Using the output

The copy strings live in the `// --- COPY ---` block near the top of `IntegrationsDirectory.tsx`, just below the `CATEGORIES` array. Each string is a named constant:

```typescript
// --- COPY ---
const HERO_H1 = "Connect to 200+ tools without writing custom sync code."
const HERO_SUBHEAD = "Pre-built integrations for every tool your team already uses."
const SEARCH_PLACEHOLDER = "Search 200+ integrations..."
// ... etc.
```

Replace each string value with the AI output. Keep the constant names exactly as they are — the component references them by name throughout the JSX.

---

## Tone calibration tips

If the AI output sounds too marketing-like, add this line to the prompt:

```
Every sentence you write should pass this test: would a senior software engineer say this out loud to a colleague without it sounding forced? If not, rewrite it until it would.
```

If the output is too terse or technical for a broader audience, add:

```
My audience includes both technical and non-technical buyers (e.g. product managers, founders). Keep the engineering voice but avoid jargon that only a backend engineer would know.
```

---

## Consistency check

After updating the copy, read the page in Preview (Cmd+P) top to bottom. Verify:
- The product name appears consistently everywhere (nav, H1, subhead, footer)
- The integration count in the stat strip matches the actual length of your `INTEGRATIONS` array
- The CTA button text makes sense as a next step for someone who has just browsed the directory
