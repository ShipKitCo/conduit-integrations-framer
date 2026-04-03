import { addPropertyControls, ControlType } from "framer"
import React, { useState, useEffect, useRef } from "react"

/**
 * Conduit Integrations Directory
 * saas-integrations-directory-v1
 *
 * Design system: shared-design-system/DESIGN-TOKENS.md
 * Reference: saas-comparison-page-v1/ComparisonPage.tsx
 *            saas-changelog-page-v1/ChangelogPage.tsx
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */

// -- Types ------------------------------------------------------------------

interface Props {
    colorMode?: "dark" | "light"
    accentColor?: string
    productName?: string
    layoutMode?: "grid" | "list"
}

interface Integration {
    name: string
    category: string
    description: string
    featured?: boolean
    brandColor?: string
    iconSlug?: string
    darkIconColor?: string
}

// -- Constants --------------------------------------------------------------

const CATEGORIES = ["All", "CRM", "Communication", "DevOps", "Analytics", "Data", "Security", "Finance"]

const INTEGRATIONS: Integration[] = [
    // CRM
    { name: "Salesforce", category: "CRM", description: "Send events to Salesforce objects and trigger workflows across your CRM pipeline.", featured: true, brandColor: "#00A1E0", iconSlug: "salesforce" },
    { name: "HubSpot", category: "CRM", description: "Sync contact properties, log activities, and trigger HubSpot sequences from events." },
    { name: "Pipedrive", category: "CRM", description: "Route deal events and contact updates directly into your Pipedrive pipeline." },
    { name: "Attio", category: "CRM", description: "Push structured records and relationship data into Attio workspaces in real time." },
    { name: "Close", category: "CRM", description: "Log calls, emails, and deal activity from your product directly to Close CRM." },
    { name: "Intercom", category: "CRM", description: "Trigger Intercom messages and update user attributes based on product events." },
    // Communication
    { name: "Slack", category: "Communication", description: "Post formatted alerts and summaries to any Slack channel or DM.", featured: true, brandColor: "#E01E5A", iconSlug: "slack", darkIconColor: "#FFFFFF" },
    { name: "Microsoft Teams", category: "Communication", description: "Deliver structured notifications to Teams channels via webhooks." },
    { name: "Discord", category: "Communication", description: "Send embeds and alerts to Discord servers with rich formatting support." },
    { name: "PagerDuty", category: "Communication", description: "Trigger and resolve PagerDuty incidents automatically from event thresholds." },
    { name: "Opsgenie", category: "Communication", description: "Create, acknowledge, and close Opsgenie alerts from any Conduit event." },
    { name: "Twilio", category: "Communication", description: "Send SMS and voice notifications triggered by critical product events." },
    // DevOps
    { name: "GitHub", category: "DevOps", description: "Open issues, trigger Actions, and annotate releases based on event data.", featured: true, brandColor: "#24292F", iconSlug: "github", darkIconColor: "#FFFFFF" },
    { name: "GitLab", category: "DevOps", description: "Trigger CI/CD pipelines and post pipeline status to GitLab projects." },
    { name: "Jira", category: "DevOps", description: "Create and update Jira issues automatically from error and threshold events." },
    { name: "Linear", category: "DevOps", description: "File Linear issues and update cycle status directly from event triggers." },
    { name: "Datadog", category: "DevOps", description: "Forward events as Datadog metrics, logs, and service check updates." },
    { name: "New Relic", category: "DevOps", description: "Route event payloads to New Relic as custom events and metric streams." },
    // Analytics
    { name: "Amplitude", category: "Analytics", description: "Forward structured product events to Amplitude for behavioral analysis." },
    { name: "Mixpanel", category: "Analytics", description: "Send events and user profile updates to Mixpanel in real time." },
    { name: "Segment", category: "Analytics", description: "Use Conduit as a Segment source to hydrate your existing analytics pipeline.", featured: true, brandColor: "#52BD94", iconSlug: "twiliosegment" },
    { name: "PostHog", category: "Analytics", description: "Pipe product events into PostHog for session replay and funnel analysis." },
    { name: "Heap", category: "Analytics", description: "Send server-side events to supplement Heap's client-side capture." },
    { name: "Rudderstack", category: "Analytics", description: "Use Conduit as a Rudderstack source with automatic schema inference." },
    // Data
    { name: "Snowflake", category: "Data", description: "Stream events directly to Snowflake tables with automatic schema creation." },
    { name: "BigQuery", category: "Data", description: "Route events to BigQuery datasets for real-time and batch analytics.", featured: true, brandColor: "#4285F4", iconSlug: "googlebigquery" },
    { name: "Redshift", category: "Data", description: "Load event payloads into Amazon Redshift with configurable batch windows." },
    { name: "dbt", category: "Data", description: "Trigger dbt Cloud jobs on event-driven schedules with payload context." },
    { name: "Airbyte", category: "Data", description: "Complement Airbyte pipelines with real-time event forwarding from Conduit." },
    { name: "Fivetran", category: "Data", description: "Extend Fivetran syncs with event-driven updates for lower latency." },
    // Security
    { name: "Okta", category: "Security", description: "Trigger Okta lifecycle events and update user group memberships programmatically." },
    { name: "Auth0", category: "Security", description: "Listen to Auth0 actions and forward authentication events downstream." },
    { name: "Splunk", category: "Security", description: "Forward security events to Splunk HEC for SIEM ingestion and alerting." },
    { name: "Cloudflare", category: "Security", description: "Route Cloudflare Workers events and WAF triggers to your event pipeline." },
    { name: "Wiz", category: "Security", description: "Pipe cloud security findings from Wiz into your incident response workflow." },
    { name: "Snyk", category: "Security", description: "Receive Snyk vulnerability events and route them to your issue tracker." },
    // Finance
    { name: "Stripe", category: "Finance", description: "Mirror Stripe webhook events into Conduit for cross-platform billing workflows.", featured: true, brandColor: "#635BFF", iconSlug: "stripe" },
    { name: "Chargebee", category: "Finance", description: "Sync subscription lifecycle events from Chargebee to downstream systems." },
    { name: "Recurly", category: "Finance", description: "Route Recurly billing events and churn signals to your analytics stack." },
    { name: "Paddle", category: "Finance", description: "Forward Paddle payment and subscription events with full payload passthrough." },
    { name: "Braintree", category: "Finance", description: "Capture Braintree transaction events and route them to your data warehouse." },
    { name: "Zuora", category: "Finance", description: "Sync Zuora subscription changes and usage records to downstream consumers." },
]

const FEATURED_ORDER = ["GitHub", "Stripe", "Slack", "Salesforce", "Segment", "BigQuery"]
const FEATURED = FEATURED_ORDER
    .map(name => INTEGRATIONS.find(i => i.name === name))
    .filter((i): i is Integration => i !== undefined)

// Marquee logo set: 12 unique logos × 2 for seamless loop
const MARQUEE_LOGOS = [
    "Salesforce", "Slack", "GitHub", "Stripe", "Segment", "BigQuery",
    "Snowflake", "Jira", "Datadog", "Amplitude", "Auth0", "Linear",
    "Salesforce", "Slack", "GitHub", "Stripe", "Segment", "BigQuery",
    "Snowflake", "Jira", "Datadog", "Amplitude", "Auth0", "Linear",
]

// -- IntegrationIcon --------------------------------------------------------

function IntegrationIcon({ name, color, size = 20 }: { name: string; color: string; size?: number }) {
    const c = color
    const icons: Record<string, React.ReactElement> = {
        // CRM
        "Salesforce": <><path d="M10 3a3 3 0 012.8 1.9A2.5 2.5 0 0115 7.5a2.5 2.5 0 01-2.5 2.5H6a3 3 0 010-6 2.5 2.5 0 012.3 1.5A3 3 0 0110 3z" fill={c}/></>,
        "HubSpot": <><circle cx="10" cy="7" r="2" fill={c}/><circle cx="15" cy="12" r="2" fill={c}/><circle cx="5" cy="12" r="2" fill={c}/><line x1="10" y1="9" x2="15" y2="12" stroke={c} strokeWidth="1.8"/><line x1="10" y1="9" x2="5" y2="12" stroke={c} strokeWidth="1.8"/></>,
        "Pipedrive": <><rect x="3" y="5" width="14" height="3" rx="1.5" fill={c}/><rect x="5" y="10" width="10" height="3" rx="1.5" fill={c} opacity="0.7"/><rect x="8" y="15" width="4" height="2.5" rx="1.25" fill={c} opacity="0.4"/></>,
        "Attio": <><polygon points="10,2 18,16 2,16" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><line x1="10" y1="8" x2="10" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        "Close": <><circle cx="10" cy="10" r="7" stroke={c} strokeWidth="1.8" fill="none"/><line x1="7" y1="7" x2="13" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="13" y1="7" x2="7" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        "Intercom": <><rect x="3" y="4" width="14" height="11" rx="3" fill={c}/><circle cx="7" cy="9.5" r="1.2" fill="white"/><circle cx="10" cy="9.5" r="1.2" fill="white"/><circle cx="13" cy="9.5" r="1.2" fill="white"/><path d="M5 15l-2 2" stroke={c} strokeWidth="2" strokeLinecap="round"/></>,
        // Communication
        "Slack": <><rect x="3" y="8.5" width="6" height="2.5" rx="1.25" fill={c}/><rect x="8.5" y="3" width="2.5" height="6" rx="1.25" fill={c}/><rect x="11" y="8.5" width="6" height="2.5" rx="1.25" fill={c} opacity="0.7"/><rect x="8.5" y="11" width="2.5" height="6" rx="1.25" fill={c} opacity="0.7"/></>,
        "Microsoft Teams": <><rect x="3" y="6" width="9" height="10" rx="2" fill={c}/><rect x="9" y="4" width="8" height="8" rx="2" fill={c} opacity="0.5"/><text x="5" y="14" fontSize="7" fontWeight="700" fill="white" fontFamily="sans-serif">T</text></>,
        "Discord": <><path d="M14 4.5c-1-.4-2-.7-3-.8L10.7 5c-1.1-.2-2.3-.2-3.4 0L7 3.7c-1 .1-2 .4-3 .8C2 8 1.4 11.4 2 14.3c1.2.9 2.4 1.4 3.5 1.7l.7-1.3c-.6-.2-1.2-.5-1.8-.9l.4-.3c2.2 1 4.7 1 6.9 0l.4.3c-.5.4-1.1.7-1.7.9l.7 1.3c1.1-.3 2.3-.8 3.5-1.7.7-3.2.1-6.5-2.6-9.8z" fill={c}/><circle cx="7.5" cy="10" r="1.5" fill="white"/><circle cx="12.5" cy="10" r="1.5" fill="white"/></>,
        "PagerDuty": <><path d="M10 2l7 13H3L10 2z" fill={c}/><line x1="10" y1="8" x2="10" y2="11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/><circle cx="10" cy="13.5" r="0.8" fill="white"/></>,
        "Opsgenie": <><path d="M10 2l7.3 4v8L10 18 2.7 14V6L10 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        "Twilio": <><circle cx="7" cy="10" r="4.5" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="13" cy="10" r="4.5" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="7" cy="10" r="1.2" fill={c}/><circle cx="13" cy="10" r="1.2" fill={c}/></>,
        // DevOps
        "GitHub": <><path d="M10 2a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.7 7.7 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0010 2z" fill={c}/></>,
        "GitLab": <><path d="M10 17L4 7.5l1.5-4 2 4h5l2-4 1.5 4L10 17z" fill={c}/><path d="M4 7.5L10 17l6-9.5" fill={c} opacity="0.5"/></>,
        "Jira": <><path d="M10 3L4 9l3 3 3-3 3 3 3-3-6-6z" fill={c}/><path d="M10 17l6-6-3-3-3 3-3-3-3 3 6 6z" fill={c} opacity="0.6"/></>,
        "Linear": <><polygon points="3,17 3,7 10,3 17,7 17,17 10,14" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><line x1="3" y1="17" x2="17" y2="3" stroke={c} strokeWidth="1.8"/></>,
        "Datadog": <><ellipse cx="10" cy="9" rx="6" ry="5" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="8" cy="8" r="1.2" fill={c}/><circle cx="12" cy="8" r="1.2" fill={c}/><path d="M8 11.5s1 1.5 4 0" stroke={c} strokeWidth="1.2" strokeLinecap="round"/><path d="M4 14l-1 3 3-1" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></>,
        "New Relic": <><circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="10" cy="10" r="4" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="10" cy="10" r="1.5" fill={c}/></>,
        // Analytics
        "Amplitude": <><rect x="2" y="14" width="3" height="4" rx="1" fill={c}/><rect x="7" y="10" width="3" height="8" rx="1" fill={c}/><rect x="12" y="6" width="3" height="12" rx="1" fill={c}/><rect x="17" y="2" width="3" height="16" rx="1" fill={c} opacity="0.5"/></>,
        "Mixpanel": <><path d="M3 16l5-8 4 5 3-4 3 7H3z" fill={c} opacity="0.3"/><path d="M3 16l5-8 4 5 3-4 3 7" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></>,
        "Segment": <><circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.8"/><path d="M10 3v7l5 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        "PostHog": <><path d="M4 18V8l6-5 6 5v10" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><rect x="7" y="12" width="6" height="6" fill={c} opacity="0.4"/><circle cx="10" cy="8.5" r="1.5" fill={c}/></>,
        "Heap": <><rect x="3" y="3" width="6" height="4" rx="1" fill={c}/><rect x="11" y="3" width="6" height="4" rx="1" fill={c} opacity="0.7"/><rect x="3" y="9" width="6" height="4" rx="1" fill={c} opacity="0.7"/><rect x="11" y="9" width="6" height="4" rx="1" fill={c} opacity="0.4"/><rect x="7" y="15" width="6" height="3" rx="1" fill={c} opacity="0.5"/></>,
        "Rudderstack": <><circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="10" cy="10" r="2" fill={c}/><line x1="10" y1="3" x2="10" y2="8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="10" y1="12" x2="10" y2="17" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="10" x2="8" y2="10" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="10" x2="17" y2="10" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        // Data
        "Snowflake": <><line x1="10" y1="2" x2="10" y2="18" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="2" y1="6" x2="18" y2="14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="18" y1="6" x2="2" y2="14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><circle cx="10" cy="2" r="1.5" fill={c}/><circle cx="10" cy="18" r="1.5" fill={c}/><circle cx="2" cy="6" r="1.5" fill={c}/><circle cx="18" cy="14" r="1.5" fill={c}/><circle cx="18" cy="6" r="1.5" fill={c}/><circle cx="2" cy="14" r="1.5" fill={c}/></>,
        "BigQuery": <><circle cx="10" cy="9" r="5.5" fill="none" stroke={c} strokeWidth="1.8"/><line x1="14" y1="13" x2="17.5" y2="16.5" stroke={c} strokeWidth="2.2" strokeLinecap="round"/><line x1="8" y1="9" x2="12" y2="9" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="10" y1="7" x2="10" y2="11" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        "Redshift": <><polygon points="10,2 17,7 17,13 10,18 3,13 3,7" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><polygon points="10,6 13.5,8.5 13.5,11.5 10,14 6.5,11.5 6.5,8.5" fill={c} opacity="0.4"/></>,
        "dbt": <><circle cx="5" cy="15" r="2.5" fill={c}/><circle cx="15" cy="15" r="2.5" fill={c}/><circle cx="10" cy="5" r="2.5" fill={c}/><line x1="5" y1="15" x2="10" y2="5" stroke={c} strokeWidth="1.8"/><line x1="15" y1="15" x2="10" y2="5" stroke={c} strokeWidth="1.8"/><line x1="5" y1="15" x2="15" y2="15" stroke={c} strokeWidth="1.8"/></>,
        "Airbyte": <><circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.8"/><path d="M10 14V7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M7.5 9.5L10 7l2.5 2.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        "Fivetran": <><rect x="3" y="3" width="4" height="4" rx="1" fill={c}/><rect x="9" y="3" width="4" height="4" rx="1" fill={c} opacity="0.7"/><rect x="15" y="3" width="2" height="14" rx="1" fill={c} opacity="0.5"/><rect x="3" y="9" width="4" height="4" rx="1" fill={c} opacity="0.7"/><rect x="9" y="9" width="4" height="4" rx="1" fill={c} opacity="0.4"/><rect x="3" y="15" width="4" height="2" rx="1" fill={c} opacity="0.4"/></>,
        // Security
        "Okta": <><circle cx="10" cy="10" r="7" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="10" cy="10" r="3" fill="none" stroke={c} strokeWidth="1.8"/></>,
        "Auth0": <><path d="M10 2l7 4v6c0 3-3 5.5-7 6-4-.5-7-3-7-6V6l7-4z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 7v4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><circle cx="10" cy="13" r="1" fill={c}/></>,
        "Splunk": <><path d="M4 10l4-7h8l-4 7h4l-8 8 2-8H4z" fill={c}/></>,
        "Cloudflare": <><path d="M14.5 12H5.5a3 3 0 010-6c.12 0 .24 0 .36.02A4 4 0 0114 8c.16-.03.32-.05.5-.05a2.5 2.5 0 010 5z" fill={c}/><path d="M6 15l1-2M10 15v-2M14 15l-1-2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        "Wiz": <><path d="M10 2l2.5 7h-5L10 2z" fill={c}/><path d="M10 18l-2.5-7h5L10 18z" fill={c} opacity="0.6"/><rect x="7" y="8.5" width="6" height="3" rx="0.5" fill={c} opacity="0.3"/></>,
        "Snyk": <><path d="M10 2l6 3.5v7L10 18 4 12.5v-7L10 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        // Finance
        "Stripe": <><path d="M5 12.5c0-3 5.5-3.8 5.5-6.5 0-1.5-1-2-2.2-2-2.2 0-3.3 1.5-3.3 3.5" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M15 7.5c0 3-5.5 3.8-5.5 6.5 0 1.5 1 2 2.2 2 2.2 0 3.3-1.5 3.3-3.5" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
        "Chargebee": <><ellipse cx="10" cy="10" rx="5" ry="6" fill="none" stroke={c} strokeWidth="1.8"/><path d="M5 8h10M5 12h10" stroke={c} strokeWidth="1.2" strokeLinecap="round"/><path d="M8 4L6 2M12 4l2-2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></>,
        "Recurly": <><path d="M15 10a5 5 0 11-5-5" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M10 5l3-1.5.5 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        "Paddle": <><rect x="8" y="2" width="4" height="16" rx="2" fill={c}/><ellipse cx="10" cy="10" rx="5" ry="3" fill={c} opacity="0.4"/></>,
        "Braintree": <><path d="M4 17V6a3 3 0 013-3h3a3 3 0 010 6H4" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 11h7a3 3 0 010 6H4" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
        "Zuora": <><path d="M4 4h12L4 16h12" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></>,
    }
    const icon = icons[name]
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {icon ?? <text x="2" y="15" fontSize="13" fontWeight="600" fill={color} fontFamily="system-ui, sans-serif">{name.slice(0, 1)}</text>}
        </svg>
    )
}

// -- Component --------------------------------------------------------------

function IntegrationsDirectory({
    colorMode = "dark",
    accentColor = "#818CF8",
    productName = "Conduit",
    layoutMode = "grid",
}: Props) {

    // -- State --------------------------------------------------------------
    const [viewportWidth, setViewportWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200
    )
    const [activeCategory, setActiveCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [activeLayoutMode, setActiveLayoutMode] = useState<"grid" | "list">(layoutMode)

    const wrapRef = useRef<HTMLDivElement>(null)

    // -- Sync layoutMode prop → state (Framer property panel changes) -------
    useEffect(() => {
        setActiveLayoutMode(layoutMode)
    }, [layoutMode])

    // -- ResizeObserver on root element -------------------------------------
    useEffect(() => {
        const el = wrapRef.current
        if (!el) return
        const ro = new ResizeObserver(entries => {
            setViewportWidth(entries[0].contentRect.width)
        })
        ro.observe(el)
        setViewportWidth(el.getBoundingClientRect().width)
        return () => ro.disconnect()
    }, [])

    // -- Derived layout booleans --------------------------------------------
    const isDark = colorMode === "dark"
    const isMobile = viewportWidth <= 640
    const isTablet = viewportWidth <= 900

    // -- Accent color parsing (handles hex and rgba from Framer canvas/preview)
    const [ar, ag, ab] = (() => {
        const rgb = accentColor.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
        if (rgb) return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])]
        const hex = accentColor.replace("#", "")
        if (/^[0-9a-fA-F]{6}$/.test(hex)) return (hex.match(/../g) || []).map((h: string) => parseInt(h, 16))
        return [129, 140, 248]
    })()

    // -- Design tokens — mirrors DESIGN-TOKENS.md exactly ------------------
    const T = isDark
        ? {
              bg: "#0D0D0D",
              surface: "#141414",
              elevated: "#1C1C1E",
              border: "rgba(255,255,255,0.08)",
              borderStr: "rgba(255,255,255,0.16)",
              text: "#F5F5F5",
              muted: "#A3A3A3",
              disabled: "rgba(255,255,255,0.25)",
              accent: accentColor,
              accentDim: `rgba(${ar},${ag},${ab},0.12)`,
              accentTint: `rgba(${ar},${ag},${ab},0.04)`,
              accentBorder: `rgba(${ar},${ag},${ab},0.40)`,
              navBg: "rgba(13,13,13,0.88)",
              logoStroke: "rgba(255,255,255,0.22)",
              logoFill: "rgba(237,237,237,0.04)",
              iconColor: "rgba(255,255,255,0.58)",
              iconBg: "rgba(255,255,255,0.05)",
              iconContainerFeatured: "rgba(255,255,255,0.05)",
          }
        : {
              bg: "#F8F8FC",
              surface: "#FFFFFF",
              elevated: "#F0F0F8",
              border: "rgba(0,0,0,0.08)",
              borderStr: "rgba(0,0,0,0.16)",
              text: "#0D0D0D",
              muted: "#6B6B6B",
              disabled: "rgba(0,0,0,0.28)",
              accent: accentColor,
              accentDim: `rgba(${ar},${ag},${ab},0.12)`,
              accentTint: `rgba(${ar},${ag},${ab},0.05)`,
              accentBorder: `rgba(${ar},${ag},${ab},0.32)`,
              navBg: "rgba(248,248,252,0.90)",
              logoStroke: "rgba(0,0,0,0.20)",
              logoFill: "rgba(0,0,0,0.02)",
              iconColor: "rgba(0,0,0,0.50)",
              iconBg: "rgba(0,0,0,0.04)",
              iconContainerFeatured: "rgba(0,0,0,0.04)",
          }

    // -- Layout constants ---------------------------------------------------
    const MAX_W = "1440px"
    const PAD_X = isMobile ? "20px" : isTablet ? "40px" : "64px"
    const SEC_V = "96px"
    const wrap = { maxWidth: MAX_W, margin: "0 auto", padding: `0 ${PAD_X}` } as React.CSSProperties

    // -- CSS injection (re-runs when mode or accent changes) ----------------
    useEffect(() => {
        const id = "id-styles"
        const existing = document.getElementById(id)
        if (existing) existing.remove()
        const ghostHover = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
        const s = document.createElement("style")
        s.id = id
        s.textContent = `
            /* Scroll-reveal */
            .id-reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.4s ease, transform 0.4s ease; }
            .id-revealed { opacity: 1; transform: translateY(0); }
            @media (prefers-reduced-motion: reduce) {
                .id-reveal, .id-revealed { transition: none; opacity: 1; transform: none; }
            }

            /* Nav links */
            .id-nav-link { transition: color 0.12s; }
            .id-nav-link:hover { color: ${T.text} !important; }

            /* Footer links */
            .id-footer-link { transition: color 0.12s; }
            .id-footer-link:hover { color: ${T.text} !important; }

            /* CTA button */
            .id-btn-primary { transition: opacity 0.15s, transform 0.15s; }
            .id-btn-primary:hover { opacity: 0.82; transform: translateY(-1px); }
            .id-btn-primary:active { opacity: 1; transform: translateY(0); }

            /* Ghost button */
            .id-btn-ghost { transition: background 0.15s, border-color 0.15s, transform 0.15s; }
            .id-btn-ghost:hover { background: ${ghostHover} !important; transform: translateY(-1px); }
            .id-btn-ghost:active { transform: translateY(0); }

            /* Search input */
            .id-search-input { transition: border-color 0.15s; }
            .id-search-input:focus { outline: 2px solid ${T.accentBorder}; outline-offset: 1px; border-color: transparent !important; }
            .id-search-input::placeholder { color: ${T.muted}; opacity: 1; }

            /* Category pill hover */
            .id-pill { transition: background 0.15s, color 0.15s, border-color 0.15s; }
            .id-pill:hover { border-color: ${T.accentBorder} !important; color: ${T.text} !important; }

            /* Category strip — hidden scrollbar */
            .id-cat-strip { display: flex; gap: 8px; overflow-x: auto; -ms-overflow-style: none; scrollbar-width: none; }
            .id-cat-strip::-webkit-scrollbar { display: none; }

            /* Featured cards */
            .id-feat-card { transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
            .id-feat-card:hover { background: ${T.elevated} !important; box-shadow: 0 4px 24px rgba(0,0,0,0.12) !important; border-color: ${T.borderStr} !important; }
            .id-feat-card:hover .id-connect-link { text-decoration: underline; }

            /* Grid/list cards */
            .id-int-card { transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease; }
            .id-int-card:hover { background: ${T.elevated} !important; box-shadow: 0 2px 12px rgba(0,0,0,0.10) !important; border-color: ${T.borderStr} !important; }
            .id-int-card:hover .id-connect-link { text-decoration: underline; }

            /* List rows */
            .id-list-row { transition: background 0.15s; }
            .id-list-row:hover { background: ${T.elevated} !important; }
            .id-list-row:hover .id-connect-link { text-decoration: underline; }

            /* Connect link */
            .id-connect-link { text-decoration: none; }

            /* Layout toggle buttons */
            .id-layout-btn { transition: background 0.15s; }
            .id-layout-btn:hover { background: ${T.elevated} !important; }

            /* Clear filters button */
            .id-clear-btn { transition: color 0.12s; }
            .id-clear-btn:hover { color: ${T.text} !important; }

            /* Marquee */
            @keyframes id-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
            .id-marquee-track { display: flex; animation: id-marquee 32s linear infinite; width: max-content; will-change: transform; }
            @media (prefers-reduced-motion: reduce) { .id-marquee-track { animation: none; } }
        `
        document.head.appendChild(s)
    }, [isDark, accentColor])

    // -- Font load ----------------------------------------------------------
    useEffect(() => {
        const id = "id-geist"
        if (!document.getElementById(id)) {
            const link = document.createElement("link")
            link.id = id
            link.rel = "stylesheet"
            link.href = "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
            document.head.appendChild(link)
        }
    }, [])

    // -- IntersectionObserver scroll-reveal ---------------------------------
    useEffect(() => {
        const container = wrapRef.current
        if (!container) return
        const observer = new IntersectionObserver(
            es => es.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add("id-revealed")
                    observer.unobserve(e.target)
                }
            }),
            { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
        )
        const timer = setTimeout(() => {
            container.querySelectorAll(".id-reveal").forEach(el => observer.observe(el))
        }, 60)
        return () => { clearTimeout(timer); observer.disconnect() }
    }, [activeCategory, searchQuery, activeLayoutMode])

    // -- Filtered integrations ----------------------------------------------
    const filteredIntegrations = INTEGRATIONS.filter(i =>
        (activeCategory === "All" || i.category === activeCategory) &&
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // -- Logo SVG -----------------------------------------------------------
    const LogoMark = ({ size = 20 }: { size?: number }) => (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <polygon
                points="10,1 18,5.5 18,14.5 10,19 2,14.5 2,5.5"
                stroke={T.logoStroke}
                strokeWidth="1.25"
                fill={T.logoFill}
            />
            <circle cx="10" cy="10" r="2.5" fill={T.accent} />
            <line x1="10" y1="7.5" x2="10" y2="1" stroke={T.accent} strokeWidth="1" strokeOpacity="0.5" />
            <line x1="10" y1="12.5" x2="10" y2="19" stroke={T.accent} strokeWidth="1" strokeOpacity="0.5" />
            <line x1="7.84" y1="8.75" x2="2" y2="5.5" stroke={T.logoStroke} strokeWidth="1" strokeOpacity="0.5" />
            <line x1="12.16" y1="11.25" x2="18" y2="14.5" stroke={T.logoStroke} strokeWidth="1" strokeOpacity="0.5" />
        </svg>
    )

    // -- Grid icon SVG ------------------------------------------------------
    const GridIcon = () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
        </svg>
    )

    // -- List icon SVG ------------------------------------------------------
    const ListIcon = () => (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="6" width="12" height="2" rx="1" fill="currentColor" />
            <rect x="1" y="10" width="12" height="2" rx="1" fill="currentColor" />
        </svg>
    )

    // -- Button styles ------------------------------------------------------
    const btnPrimary: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "10px 22px", borderRadius: "6px",
        fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
        background: T.accent, color: "#000",
        border: "none", cursor: "pointer", textDecoration: "none",
        whiteSpace: "nowrap",
    }
    const btnGhost: React.CSSProperties = {
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        padding: "10px 22px", borderRadius: "6px",
        fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
        background: "transparent", color: T.text,
        border: `1px solid ${T.borderStr}`, cursor: "pointer",
        textDecoration: "none", whiteSpace: "nowrap",
    }

    // =========================================================================
    // Render
    // =========================================================================
    return (
        <div
            ref={wrapRef}
            className="id-wrap"
            style={{
                fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif",
                background: T.bg,
                color: T.text,
                fontSize: "15px",
                lineHeight: "1.6",
                WebkitFontSmoothing: "antialiased",
                width: "100%",
                overflowX: "clip",
            }}
        >

            {/* ══ NAV ══════════════════════════════════════════════════════ */}
            <nav style={{
                position: "sticky", top: 0, zIndex: 100,
                background: T.navBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: `1px solid ${T.border}`,
            }}>
                <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LogoMark />
                        <span style={{ fontSize: "15px", fontWeight: 500, letterSpacing: "-0.02em", color: T.text }}>
                            {productName}
                        </span>
                    </div>
                    {/* Nav links (hidden on mobile) */}
                    <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: "24px" }}>
                        {["Docs", "API Reference", "Changelog", "Pricing"].map(link => (
                            <a
                                key={link}
                                href="#"
                                className="id-nav-link"
                                style={{ fontSize: "13px", color: T.muted, textDecoration: "none" }}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                    {/* CTA */}
                    <button
                        className="id-btn-primary"
                        style={{
                            display: "inline-flex", alignItems: "center",
                            height: "32px", padding: "0 14px", borderRadius: "6px",
                            fontSize: "13px", fontWeight: 500, fontFamily: "inherit",
                            background: T.accent, color: "#000",
                            border: "none", cursor: "pointer",
                        }}
                    >
                        Get started
                    </button>
                </div>
            </nav>

            {/* ══ HERO ══════════════════════════════════════════════════════ */}
            <section style={{ padding: `${SEC_V} 0 0`, position: "relative", overflow: "hidden" }}>
                {/* Atmospheric gradient */}
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "480px",
                    background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${T.accentTint} 0%, transparent 70%)`,
                    pointerEvents: "none",
                }} />

                <div style={{ ...wrap, textAlign: "center", position: "relative" }}>
                    {/* Eyebrow pill */}
                    <div style={{ marginBottom: "24px" }}>
                        <span style={{
                            display: "inline-flex", alignItems: "center",
                            padding: "5px 14px",
                            borderRadius: "20px",
                            background: T.accentDim,
                            border: `1px solid ${T.accentBorder}`,
                            color: T.accent,
                            fontSize: "12px",
                            fontWeight: 500,
                            letterSpacing: "0.04em",
                        }}>
                            500+ integrations
                        </span>
                    </div>

                    {/* H1 */}
                    <h1 style={{
                        fontSize: "clamp(32px, 4vw, 52px)",
                        fontWeight: 400,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: T.text,
                        marginBottom: "20px",
                        maxWidth: "720px",
                        margin: "0 auto 20px",
                    }}>
                        Route events to every tool in your stack.
                    </h1>

                    {/* Subhead */}
                    <p style={{
                        fontSize: "16px",
                        color: T.muted,
                        lineHeight: 1.6,
                        maxWidth: "560px",
                        margin: "0 auto 36px",
                        letterSpacing: "-0.01em",
                    }}>
                        {productName} routes your product events to 500+ destinations. No glue code, no custom pipelines.
                    </p>

                    {/* Search input */}
                    <div style={{
                        position: "relative",
                        maxWidth: "540px",
                        margin: "0 auto 16px",
                    }}>
                        {/* Magnifying glass icon */}
                        <svg
                            width="16" height="16" viewBox="0 0 16 16" fill="none"
                            style={{
                                position: "absolute", left: "14px", top: "50%",
                                transform: "translateY(-50%)",
                                color: T.muted, pointerEvents: "none",
                            }}
                        >
                            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                            <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            className="id-search-input"
                            placeholder={"Search integrations\u2026"}
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                height: "44px",
                                background: T.surface,
                                border: `1px solid ${T.border}`,
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontFamily: "inherit",
                                color: T.text,
                                padding: "0 16px 0 40px",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Stat strip */}
                    <p style={{
                        fontSize: "13px",
                        color: T.muted,
                        letterSpacing: "-0.01em",
                    }}>
                        42 integrations{" "}{"\u00B7"}{" "}7 categories{" "}{"\u00B7"}{" "}REST + webhooks
                    </p>
                </div>

                {/* ── Marquee strip (bottom of hero) ─────────────────────── */}
                <div style={{
                    paddingTop: "56px",
                    paddingBottom: "16px",
                    overflow: "hidden",
                    WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                    maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                }}>
                    <div className="id-marquee-track">
                        {MARQUEE_LOGOS.map((logoName, idx) => (
                            <div
                                key={`${logoName}-${idx}`}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "6px",
                                    marginRight: "40px",
                                    flexShrink: 0,
                                }}
                            >
                                <IntegrationIcon name={logoName} color={T.iconColor} size={20} />
                                <span style={{
                                    fontSize: "11px",
                                    fontWeight: 500,
                                    color: T.muted,
                                    whiteSpace: "nowrap",
                                }}>
                                    {logoName}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURED INTEGRATIONS ════════════════════════════════════ */}
            <section style={{ padding: `0 0 ${SEC_V}` }}>
                <div style={{ ...wrap }}>
                    {/* Section header */}
                    <div className="id-reveal" style={{ marginBottom: "32px", paddingTop: SEC_V }}>
                        <h2 style={{
                            fontSize: "22px",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            color: T.text,
                            lineHeight: 1.2,
                        }}>
                            Featured Integrations
                        </h2>
                    </div>

                    {/* Featured grid — individual cards with gap */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr 1fr 1fr",
                        gap: "16px",
                    }}>
                        {FEATURED.map((integration, idx) => {
                            const iconHex = (isDark && integration.darkIconColor
                                ? integration.darkIconColor
                                : integration.brandColor ?? "#818CF8"
                            ).replace("#", "")
                            return (
                                <div
                                    key={integration.name}
                                    className="id-feat-card id-reveal"
                                    style={{
                                        background: "transparent",
                                        border: `1px solid ${T.border}`,
                                        borderRadius: "12px",
                                        padding: "24px",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        transitionDelay: `${idx * 40}ms`,
                                    }}
                                >
                                    {/* Icon container */}
                                    <div style={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "12px",
                                        background: integration.iconSlug
                                            ? T.iconContainerFeatured
                                            : (integration.brandColor ? integration.brandColor + "1A" : T.iconBg),
                                        border: `1px solid ${T.border}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "16px",
                                        flexShrink: 0,
                                        overflow: "hidden",
                                    }}>
                                        {integration.iconSlug ? (
                                            <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
                                                <img
                                                    src={
                                                        isDark && integration.darkIconColor
                                                            ? `https://cdn.simpleicons.org/${integration.iconSlug}/${integration.darkIconColor.replace("#", "")}`
                                                            : `https://cdn.simpleicons.org/${integration.iconSlug}/${(integration.brandColor ?? "#818CF8").replace("#", "")}`
                                                    }
                                                    alt={integration.name}
                                                    width={28}
                                                    height={28}
                                                    style={{ objectFit: "contain", display: "block" }}
                                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                        const img = e.currentTarget
                                                        img.style.display = "none"
                                                        const fallback = img.nextSibling as HTMLElement | null
                                                        if (fallback) fallback.style.display = "flex"
                                                    }}
                                                />
                                                <div style={{
                                                    display: "none",
                                                    position: "absolute",
                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}>
                                                    <IntegrationIcon
                                                        name={integration.name}
                                                        color={integration.brandColor || T.iconColor}
                                                        size={28}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <IntegrationIcon
                                                name={integration.name}
                                                color={integration.brandColor || T.iconColor}
                                                size={28}
                                            />
                                        )}
                                    </div>
                                    {/* Name */}
                                    <div style={{
                                        fontSize: "15px",
                                        fontWeight: 500,
                                        color: T.text,
                                        letterSpacing: "-0.01em",
                                        marginBottom: "6px",
                                    }}>
                                        {integration.name}
                                    </div>
                                    {/* Description — full, not clamped, for featured */}
                                    <div style={{
                                        fontSize: "13px",
                                        color: T.muted,
                                        lineHeight: 1.55,
                                        flex: 1,
                                        marginBottom: "16px",
                                    }}>
                                        {integration.description}
                                    </div>
                                    {/* CTA */}
                                    <a
                                        href="#"
                                        className="id-connect-link"
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            color: T.accent,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        Connect {"\u2192"}
                                    </a>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ══ ALL INTEGRATIONS ═════════════════════════════════════════ */}
            <section style={{ padding: `0 0 ${SEC_V}` }}>
                <div style={{ ...wrap }}>
                    {/* Row 1: Marketplace heading + layout toggle */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                            paddingTop: SEC_V,
                        }}
                    >
                        <h2 style={{ fontSize: "22px", fontWeight: 400, letterSpacing: "-0.02em", color: T.text }}>
                            Marketplace
                            <span style={{
                                fontSize: "11px",
                                fontWeight: 400,
                                color: T.muted,
                                verticalAlign: "super",
                                marginLeft: "4px",
                                letterSpacing: 0,
                                lineHeight: 1,
                            }}>
                                {filteredIntegrations.length}
                            </span>
                        </h2>
                        {/* Right: layout toggle */}
                        <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                            <button
                                className="id-layout-btn"
                                onClick={() => setActiveLayoutMode("grid")}
                                aria-label="Grid layout"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "6px",
                                    border: `1px solid ${T.border}`,
                                    background: activeLayoutMode === "grid" ? T.accentDim : "transparent",
                                    color: activeLayoutMode === "grid" ? T.accent : T.muted,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <GridIcon />
                            </button>
                            <button
                                className="id-layout-btn"
                                onClick={() => setActiveLayoutMode("list")}
                                aria-label="List layout"
                                style={{
                                    width: "28px",
                                    height: "28px",
                                    borderRadius: "6px",
                                    border: `1px solid ${T.border}`,
                                    background: activeLayoutMode === "list" ? T.accentDim : "transparent",
                                    color: activeLayoutMode === "list" ? T.accent : T.muted,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <ListIcon />
                            </button>
                        </div>
                    </div>

                    {/* Row 2: filter pill strip + result count */}
                    <div
                        className="id-reveal"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginTop: "20px",
                            marginBottom: "20px",
                        }}
                    >
                        {/* Pills — take available space, scrollable */}
                        <div className="id-cat-strip" style={{ flex: 1, minWidth: 0 }}>
                            {CATEGORIES.map(cat => {
                                const isActive = activeCategory === cat
                                return (
                                    <button
                                        key={cat}
                                        className="id-pill"
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "10px 16px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            fontFamily: "inherit",
                                            whiteSpace: "nowrap",
                                            cursor: "pointer",
                                            border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                                            background: isActive ? T.accentDim : "transparent",
                                            color: isActive ? T.accent : T.muted,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {cat}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Empty state */}
                    {filteredIntegrations.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "64px 0",
                        }}>
                            <p style={{ fontSize: "14px", color: T.muted, marginBottom: "16px" }}>
                                No integrations match your search.
                            </p>
                            <button
                                className="id-clear-btn"
                                onClick={() => { setSearchQuery(""); setActiveCategory("All") }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                    fontFamily: "inherit",
                                    color: T.muted,
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                }}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    {/* Grid layout */}
                    {filteredIntegrations.length > 0 && activeLayoutMode === "grid" && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
                            gap: "10px",
                        }}>
                            {filteredIntegrations.map((integration, idx) => (
                                <div
                                    key={`${integration.name}-${idx}`}
                                    className="id-int-card id-reveal"
                                    style={{
                                        background: "transparent",
                                        border: `1px solid ${T.border}`,
                                        borderRadius: "10px",
                                        padding: "18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        transitionDelay: `${(idx % 8) * 25}ms`,
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Icon container */}
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "9px",
                                        background: T.iconBg,
                                        border: `1px solid ${T.border}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "12px",
                                        flexShrink: 0,
                                    }}>
                                        <IntegrationIcon name={integration.name} color={T.iconColor} size={22} />
                                    </div>
                                    {/* Name */}
                                    <div style={{
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        color: T.text,
                                        letterSpacing: "-0.01em",
                                        marginBottom: "4px",
                                    }}>
                                        {integration.name}
                                    </div>
                                    {/* Description — 2-line clamp */}
                                    <div style={{
                                        fontSize: "11px",
                                        color: T.muted,
                                        lineHeight: 1.45,
                                        flex: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        marginBottom: "10px",
                                    } as React.CSSProperties}>
                                        {integration.description}
                                    </div>
                                    {/* CTA */}
                                    <a
                                        href="#"
                                        className="id-connect-link"
                                        style={{
                                            fontSize: "11px",
                                            fontWeight: 500,
                                            color: T.accent,
                                        }}
                                    >
                                        Connect {"\u2192"}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* List layout */}
                    {filteredIntegrations.length > 0 && activeLayoutMode === "list" && (
                        <div style={{ background: "transparent" }}>
                            {filteredIntegrations.map((integration, idx) => (
                                <div
                                    className="id-list-row id-reveal"
                                    key={`${integration.name}-list-${idx}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: isMobile ? "20px 10px" : "20px 18px",
                                        gap: "20px",
                                        borderBottom: idx < filteredIntegrations.length - 1 ? `1px solid ${T.border}` : "none",
                                        transitionDelay: `${(idx % 12) * 15}ms`,
                                    }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "8px",
                                        background: T.iconBg,
                                        border: `1px solid ${T.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <IntegrationIcon name={integration.name} color={T.iconColor} size={20} />
                                    </div>
                                    {/* Middle */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 500, color: T.text, letterSpacing: "-0.01em" }}>
                                                {integration.name}
                                            </span>
                                            <span style={{
                                                fontSize: "9px", fontWeight: 500, textTransform: "uppercase" as const,
                                                letterSpacing: "0.06em", padding: "2px 6px", borderRadius: "3px",
                                                background: T.elevated, color: T.muted, flexShrink: 0,
                                            }}>
                                                {integration.category}
                                            </span>
                                        </div>
                                        <div style={{
                                            fontSize: "13px", color: T.muted, lineHeight: 1.4,
                                            marginTop: "2px", overflow: "hidden", whiteSpace: "nowrap" as const, textOverflow: "ellipsis",
                                        }}>
                                            {integration.description}
                                        </div>
                                    </div>
                                    {/* CTA */}
                                    <a href="#" className="id-connect-link" style={{
                                        fontSize: "12px", color: T.accent, fontWeight: 500,
                                        flexShrink: 0, marginLeft: "auto", whiteSpace: "nowrap" as const,
                                    }}>
                                        Connect {"\u2192"}
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══ BUILD YOUR OWN CTA ═══════════════════════════════════════ */}
            <section style={{ padding: `${SEC_V} 0` }}>
                <div style={{ ...wrap, textAlign: "center" }}>
                    <div className="id-reveal">
                        {/* Eyebrow */}
                        <p style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: T.accent,
                            marginBottom: "12px",
                        }}>
                            Custom integrations
                        </p>
                        {/* H2 */}
                        <h2 style={{
                            fontSize: "28px",
                            fontWeight: 400,
                            letterSpacing: "-0.03em",
                            color: T.text,
                            lineHeight: 1.2,
                            marginBottom: "16px",
                        }}>
                            Missing a destination? Ship it yourself.
                        </h2>
                        {/* Body */}
                        <p style={{
                            fontSize: "15px",
                            color: T.muted,
                            lineHeight: 1.6,
                            maxWidth: "480px",
                            margin: "0 auto 32px",
                            letterSpacing: "-0.01em",
                        }}>
                            The {productName} Webhooks API routes events to any endpoint. If it accepts HTTP, you can connect it{"\u2014"}in minutes.
                        </p>
                        {/* Buttons */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                        }}>
                            <button className="id-btn-primary" style={btnPrimary}>
                                Browse the API {"\u2192"}
                            </button>
                            <button className="id-btn-ghost" style={btnGhost}>
                                View webhook docs
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer style={{ borderTop: `1px solid ${T.border}` }}>
                <div style={{
                    ...wrap,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "16px",
                    padding: `24px ${PAD_X}`,
                }}>
                    {/* Logo + name */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <LogoMark size={16} />
                        <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em", color: T.muted }}>
                            {productName}
                        </span>
                    </div>
                    {/* Copyright */}
                    <span style={{ fontSize: "13px", color: T.disabled }}>
                        {"\u00A9"} 2026 {productName}. All rights reserved.
                    </span>
                    {/* Links */}
                    <div style={{ display: "flex", gap: "20px" }}>
                        {["Privacy", "Terms", "Docs", "Status"].map(link => (
                            <a
                                key={link}
                                href="#"
                                className="id-footer-link"
                                style={{ color: T.muted, textDecoration: "none", fontSize: "13px" }}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default IntegrationsDirectory

// -- Property controls for Framer panel -------------------------------------
addPropertyControls(IntegrationsDirectory, {
    colorMode: {
        type: ControlType.Enum,
        title: "Color Mode",
        options: ["dark", "light"],
        optionTitles: ["Dark", "Light"],
        defaultValue: "dark",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#818CF8",
    },
    productName: {
        type: ControlType.String,
        title: "Product Name",
        defaultValue: "Conduit",
        placeholder: "Your product name",
    },
    layoutMode: {
        type: ControlType.Enum,
        title: "Layout Mode",
        options: ["grid", "list"],
        optionTitles: ["Grid", "List"],
        defaultValue: "grid",
    },
})
