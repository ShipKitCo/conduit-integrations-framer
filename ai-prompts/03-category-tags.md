# AI Prompt 03 — Customize Your Category Structure

Use this prompt when the 7 default categories do not fit your integration list — or when you want category names that are more specific to your product's audience.

Common reasons to run this prompt:
- You work in a specialized vertical (healthcare SaaS, legal tech, fintech) and have categories like "EHR," "eDiscovery," or "Ledger"
- You have many integrations in one default category and want to split it (e.g. "Analytics" → "Product Analytics" + "Data Warehouse")
- You want to rename default categories to match your product's voice (e.g. "Developer Tools" → "CI/CD" if you're a DevOps product)

---

## Prompt

```
I am building a SaaS integrations directory page. The template has 7 category filter tags that appear above the integration grid. I need you to suggest the best set of 6–8 categories for my specific integration list, then output the updated arrays ready to paste into the TypeScript file.

My product: [YOUR_PRODUCT_NAME]
My audience: [YOUR_TARGET_AUDIENCE]
My integration list (tool names, one per line):

[PASTE YOUR FULL INTEGRATION LIST HERE]

Step 1 — Analyze my list
Group the tools by natural category. Identify:
- Which groups have more than 8 tools (candidates to split into two categories)
- Which groups have fewer than 3 tools (candidates to merge into a broader category)
- Whether any tools clearly belong to a vertical-specific category that has no good match in a generic taxonomy

Step 2 — Propose 6–8 category names
Rules:
- Include "All" as the first category (always required — it is the "show everything" filter)
- Use 1–3 word names only. No colons, no slashes.
- Names should be immediately recognizable to a developer at [YOUR_TARGET_AUDIENCE] company — use the words they actually use, not generic marketing terms
- If your audience is vertical-specific, use the vertical term (e.g. "EHR" not "Healthcare Records")
- Each category should contain at least 3 integrations from my list
- Do not create a catch-all category named "Other" — if tools don't fit, assign the nearest category and note it

Step 3 — Output the CATEGORIES array
Format:

const CATEGORIES = [
  "All",
  "Category One",
  "Category Two",
  // ... up to 8 total including "All"
]

Step 4 — Output the updated INTEGRATIONS array
For each tool in my list, output a TypeScript object with these fields:
- name: official display name
- category: assigned category (must exactly match one of your proposed categories)
- description: one sentence, engineering voice, under 18 words, mentions a specific technical capability
- initials: 2 uppercase letters
- colorIdx: start at 0 for the first entry, increment by 1, wrap at 7
- featured: true for the 6–12 most widely recognized tools; false for all others

Output format:
1. Step 1 analysis (brief — 3–6 sentences)
2. Step 2 category proposals with the count of tools assigned to each
3. The CATEGORIES array as valid TypeScript (no code fence)
4. The INTEGRATIONS array as valid TypeScript (no code fence)
5. A short note on any tools you could not cleanly assign and why

Do not wrap any code in a code fence. Output raw TypeScript so I can paste it directly.
```

---

## Handling edge cases

### Too many tools in one category

If the AI assigns more than 12 tools to one category, prompt it to split:

```
"Analytics" has 15 tools. Split it into two categories: "Product Analytics" for tools focused on user behavior tracking, and "Data Warehouse" for tools focused on data storage and SQL querying. Reassign the tools accordingly and update the CATEGORIES array.
```

### Vertical-specific categories

For specialized verticals, add context before the tool list:

```
My product is used by [healthcare / legal / fintech / etc.] companies. Use industry-standard terminology for category names. For example, "EHR" is more appropriate than "Healthcare Records" for this audience.
```

### Renaming a default category without changing assignments

If you only want to rename categories (not restructure them):

```
Keep the same category assignments as the current INTEGRATIONS array. Only rename the categories as follows:
- "Developer Tools" → "CI/CD & DevOps"
- "Storage" → "Data Warehouse"
Output only the updated CATEGORIES array and the updated `category` field on each INTEGRATIONS entry.
```

---

## After pasting

1. Open `IntegrationsDirectory.tsx`
2. Replace the `const CATEGORIES = [` block with the AI output
3. Replace the `const INTEGRATIONS = [` block with the updated array
4. Save → Preview (Cmd+P)
5. Click each category filter in turn — verify the correct integrations appear for each
6. Verify "All" shows the full list
