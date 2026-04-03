# AI Prompt 01 — Rebrand to Your Product

Copy the prompt below and paste it into Claude or ChatGPT. Fill in every `[PLACEHOLDER]` before sending.

---

## Prompt

```
You are helping me customize a Framer code component for a SaaS integrations directory page.

The template currently uses a fictional product called "Conduit." I need you to output updated copy strings and an updated INTEGRATIONS array for my real product.

Here is my product information:

- Product name: [YOUR_PRODUCT_NAME]
- Tagline: [YOUR_TAGLINE] (one sentence, no exclamation marks, engineering-voice)
- Integration count: [YOUR_INTEGRATION_COUNT] (the total number of integrations I support)
- Target audience: [YOUR_TARGET_AUDIENCE] (e.g. "backend engineers", "growth teams at B2B SaaS companies")
- Primary use case: [PRIMARY_USE_CASE] (e.g. "syncing customer data between tools", "triggering workflows from product events")

Here are the copy strings I need you to update. Output each one on its own labeled line, ready to paste into the TSX:

1. NAV_LOGO — the product name shown in the top-left nav. Should be: [YOUR_PRODUCT_NAME]
2. HERO_H1 — the main H1 headline. It should reference the integration count and the primary use case. Keep it under 12 words. No exclamation marks. Example format: "Connect [YOUR_PRODUCT_NAME] to [COUNT]+ tools your team already uses."
3. HERO_SUBHEAD — one sentence below the H1. Explain what buyers gain by using the integrations. Under 20 words.
4. SEARCH_PLACEHOLDER — placeholder text inside the search input. Format: "Search [COUNT]+ integrations..."
5. STAT_1_LABEL and STAT_1_VALUE — first stat in the strip below search (e.g. "integrations" / "[COUNT]+")
6. STAT_2_LABEL and STAT_2_VALUE — second stat (e.g. "categories" / "7")
7. STAT_3_LABEL and STAT_3_VALUE — third stat — choose something relevant (e.g. "avg setup time" / "< 5 min" or "API calls/month" / "1B+")
8. CTA_PRIMARY — primary CTA button text. Under 5 words. No "Get started" or "Sign up." Use action language specific to the product.
9. CTA_SECONDARY — secondary CTA, e.g. "View docs" or "Read the API reference"
10. FOOTER_COPYRIGHT — e.g. "© 2026 [YOUR_PRODUCT_NAME]. All rights reserved."

Now, here is my actual integration list. These are the real tools [YOUR_PRODUCT_NAME] connects to:

[PASTE YOUR INTEGRATION LIST HERE — tool names, one per line, 10–50 items]

For each integration in my list, generate one entry in this TypeScript format:

{
  name: "Tool Name",
  category: "Category",          // must be one of the 7 categories listed below
  description: "One sentence.",  // engineering-voice, specific, not generic
  initials: "TN",                // 2 letters
  colorIdx: 0,                   // increment 0–7, cycling for long lists
  featured: true,                // true for the 6–12 most widely-known integrations only
}

The 7 allowed category values are:
- CRM
- Analytics
- Communication
- Storage
- Payments
- Developer Tools
- Marketing

If one of my integrations does not fit cleanly into any of the 7 categories, assign the closest match and note it at the end of your output.

Output format:
1. All 10 copy strings, each on a labeled line
2. The complete INTEGRATIONS array, formatted as valid TypeScript, ready to paste into the file

Do not add commentary between the array entries. Do not wrap the output in a code fence — output the raw TypeScript so I can paste it directly.

Maintain a precise, engineering-friendly voice throughout. No superlatives. No exclamation marks.
```

---

## How to use the output

1. Open `IntegrationsDirectory.tsx`
2. Find the `INTEGRATIONS` constant near the top of the file and replace it with the array from the AI output
3. Find the copy constants block (labeled `// --- COPY ---` in the file) and replace each string with the labeled output values
4. Save → Preview in Framer (Cmd+P) to verify

---

## Tips

- If you have more than 50 integrations, run the prompt in batches of 25–30. The AI will maintain consistent `colorIdx` cycling if you tell it which number to start from in each batch (e.g. "start colorIdx at 12 for this batch").
- If your product has categories that don't fit the 7 defaults (e.g. "EHR" for healthcare SaaS), ask the AI to also output an updated `CATEGORIES` array. Then see `03-category-tags.md` for the full category customization prompt.
- The AI will sometimes write generic descriptions ("A popular CRM tool"). Add this line to the prompt if that happens: "Descriptions must mention a specific technical capability, not just the category. Reject any description that could apply to more than one tool in the same category."
