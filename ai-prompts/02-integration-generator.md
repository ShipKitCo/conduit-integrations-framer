# AI Prompt 02 — Generate Your Full Integration List

Use this prompt to turn a raw list of integration names into a complete, paste-ready `INTEGRATIONS` array.

This is the core data-entry task for this template. If you have 20–50 integrations, this prompt does in 30 seconds what would otherwise take an hour of manual writing.

---

## Prompt

```
I am building a SaaS integrations directory page. I have a list of integration names and I need you to generate a complete TypeScript array for each one.

My product connects to the following tools (one per line):

[PASTE YOUR LIST HERE]

For every tool in my list, output one TypeScript object with these exact fields:

{
  name: "Exact Tool Name",
  category: "Category",
  description: "One sentence.",
  initials: "XX",
  colorIdx: 0,
  featured: false,
}

Field rules:

NAME
Use the tool's official display name (e.g. "HubSpot" not "hubspot", "GitHub" not "Github").

CATEGORY
Assign exactly one of these 7 values — no others:
- CRM
- Analytics
- Communication
- Storage
- Payments
- Developer Tools
- Marketing

If a tool spans multiple categories (e.g. Notion = Storage + Communication), pick the category that best describes how a developer would use it in an integration context.

DESCRIPTION
Write one sentence in engineering voice. Requirements:
- Mention a specific technical capability or data object (e.g. "contacts", "webhooks", "event stream", "invoices")
- Do not write generic descriptions like "A popular project management tool."
- Do not start with the tool name — start with the capability
- No exclamation marks, no superlatives
- Under 18 words
- Examples of good descriptions:
  - "Sync contact records and deal stage changes in real time via HubSpot's CRM API."
  - "Trigger Slack messages from product events using Slack's Incoming Webhooks."
  - "Push revenue events and subscription lifecycle data to Stripe via the REST API."

INITIALS
2 uppercase letters. Use the first letter of each word in the tool name (e.g. "HubSpot" → "HS", "GitHub" → "GH", "Salesforce" → "SF"). If the name is one word, use the first two letters in uppercase (e.g. "Notion" → "NO", "Stripe" → "ST").

COLORIDX
Start at 0 for the first entry. Increment by 1 for each entry. When you reach 7, wrap back to 0. Continue this cycle for the full list. Do not repeat a colorIdx within the same 8 consecutive entries.

FEATURED
Set featured: true for the 6 to 12 most widely recognized tools in the list — tools that buyers will immediately recognize by name regardless of industry. Set featured: false for all others. Do not set more than 12 as featured. If the list has fewer than 12 tools, set the most well-known half as featured.

Output format:
- Output the complete array as valid TypeScript
- Start with: const INTEGRATIONS = [
- End with: ]
- No comments inside the array
- No blank lines between entries
- One entry per line
- Do not wrap in a code fence
- Do not add any text before or after the array

After the array, add a short plain-text note listing:
- Which tools you were uncertain about for category assignment, and why
- Any tools where you could not write a specific description (name them and explain)
```

---

## Example input / output

**You provide:**

```
Salesforce
Slack
GitHub
Stripe
Mixpanel
Notion
Twilio
Snowflake
Intercom
Zendesk
```

**AI outputs:**

```typescript
const INTEGRATIONS = [
  { name: "Salesforce", category: "CRM", description: "Sync opportunity records and account updates via the Salesforce REST API.", initials: "SF", colorIdx: 0, featured: true },
  { name: "Slack", category: "Communication", description: "Send messages and post structured blocks to channels via Slack's Incoming Webhooks.", initials: "SL", colorIdx: 1, featured: true },
  { name: "GitHub", category: "Developer Tools", description: "Trigger workflows from repository events using GitHub Webhooks and the REST API.", initials: "GH", colorIdx: 2, featured: true },
  { name: "Stripe", category: "Payments", description: "Push subscription lifecycle events and invoice status changes to Stripe.", initials: "ST", colorIdx: 3, featured: true },
  { name: "Mixpanel", category: "Analytics", description: "Forward product events and user property updates to Mixpanel via the Ingestion API.", initials: "MI", colorIdx: 4, featured: true },
  { name: "Notion", category: "Storage", description: "Create and update database rows in Notion workspaces via the Notion API.", initials: "NO", colorIdx: 5, featured: true },
  { name: "Twilio", category: "Communication", description: "Send SMS and trigger voice calls from product events using Twilio Programmable Messaging.", initials: "TW", colorIdx: 6, featured: false },
  { name: "Snowflake", category: "Storage", description: "Stream event data into Snowflake tables using the Snowpipe continuous ingestion API.", initials: "SN", colorIdx: 7, featured: false },
  { name: "Intercom", category: "CRM", description: "Create contacts and post conversation events to Intercom via the REST API.", initials: "IN", colorIdx: 0, featured: false },
  { name: "Zendesk", category: "CRM", description: "Open and update support tickets from product events using the Zendesk Tickets API.", initials: "ZE", colorIdx: 1, featured: false },
]
```

---

## Running in batches for large lists

If you have more than 40 integrations, split into batches of 20–25.

For batch 2 and beyond, add this line to the prompt:

```
Start colorIdx at [N] for the first entry in this batch, where N is the colorIdx that would come next after your previous batch.
```

Example: if your first batch of 24 ended at colorIdx 7 (entry 24 = colorIdx 7), tell the AI to start batch 2 at colorIdx 0 (since 24 % 8 = 0).

After all batches are complete, concatenate the arrays manually and paste the full result into the file.

---

## After pasting

1. Open `IntegrationsDirectory.tsx`
2. Find the existing `const INTEGRATIONS = [` block
3. Replace the entire block (from `const INTEGRATIONS = [` through the closing `]`) with the AI output
4. Save → Preview (Cmd+P)
5. Verify: search for one tool by name, verify it appears; click a category filter, verify only that category's tools show
