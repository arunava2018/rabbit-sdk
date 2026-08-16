export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {}

export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "GitHub",
      href: "https://github.com/arunava2018/rabbit-sdk",
      external: true,
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/getting-started/introduction",
          items: [],
        },
        {
          title: "Installation",
          href: "/docs/getting-started/installation",
          items: [],
        },
        {
          title: "Quick Start",
          href: "/docs/getting-started/quick-start",
          items: [],
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Providers",
          href: "/docs/core-concepts/providers",
          items: [],
        },
        {
          title: "Agents",
          href: "/docs/core-concepts/agents",
          items: [],
        },
        {
          title: "Tools",
          href: "/docs/core-concepts/tools",
          items: [],
        },
        {
          title: "Memory",
          href: "/docs/core-concepts/memory",
          items: [],
        },
      ],
    },
    {
      title: "Features",
      items: [
        {
          title: "Guardrails",
          href: "/docs/features/guardrails",
          items: [],
        },
        {
          title: "Streaming",
          href: "/docs/features/streaming",
          items: [],
        },
        {
          title: "Provider Fallbacks",
          href: "/docs/features/provider-fallbacks",
          items: [],
        },
        {
          title: "Built-in Tools",
          href: "/docs/features/built-in-tools",
          items: [],
        },
        {
          title: "Error Handling",
          href: "/docs/features/error-handling",
          items: [],
        },
        {
          title: "Tracing & Reliability",
          href: "/docs/features/tracing-and-reliability",
          items: [],
        },
        {
          title: "Agent Handoffs",
          href: "/docs/features/handoffs",
          items: [],
        },
      ],
    },
    {
      title: "Recipes",
      items: [
        {
          title: "Customer Support Agent",
          href: "/docs/recipes/customer-support",
          items: [],
        },
        {
          title: "Data Extraction",
          href: "/docs/recipes/data-extraction",
          items: [],
        },
      ],
    },
    {
      title: "Advanced",
      items: [
        {
          title: "Custom Providers",
          href: "/docs/advanced/custom-providers",
          items: [],
        },
        {
          title: "API Reference",
          href: "/docs/advanced/api-reference",
          items: [],
        },
      ],
    },
  ],
}

/**
 * Flat ordered list of all doc pages for prev/next navigation.
 * Order matches the sidebar progression.
 */
export interface DocPageLink {
  title: string
  href: string
}

export const docsPageOrder: DocPageLink[] = [
  { title: "Introduction", href: "/docs/getting-started/introduction" },
  { title: "Installation", href: "/docs/getting-started/installation" },
  { title: "Quick Start", href: "/docs/getting-started/quick-start" },
  { title: "Providers", href: "/docs/core-concepts/providers" },
  { title: "Agents", href: "/docs/core-concepts/agents" },
  { title: "Tools", href: "/docs/core-concepts/tools" },
  { title: "Memory", href: "/docs/core-concepts/memory" },
  { title: "Guardrails", href: "/docs/features/guardrails" },
  { title: "Streaming", href: "/docs/features/streaming" },
  { title: "Provider Fallbacks", href: "/docs/features/provider-fallbacks" },
  { title: "Built-in Tools", href: "/docs/features/built-in-tools" },
  { title: "Error Handling", href: "/docs/features/error-handling" },
  { title: "Tracing & Reliability", href: "/docs/features/tracing-and-reliability" },
  { title: "Agent Handoffs", href: "/docs/features/handoffs" },
  { title: "Customer Support Agent", href: "/docs/recipes/customer-support" },
  { title: "Data Extraction", href: "/docs/recipes/data-extraction" },
  { title: "Custom Providers", href: "/docs/advanced/custom-providers" },
  { title: "API Reference", href: "/docs/advanced/api-reference" },
]
