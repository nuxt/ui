/**
 * Canonical site URL, shared by every server route that bakes absolute links
 * into a response (OpenAPI, sitemaps, the MCP server card, `llms.txt`).
 *
 * `nuxt-agent-discovery` is configured with the same value through
 * `agentDiscovery.siteUrl`, so its own documents agree with these.
 */
export const SITE_URL = 'https://ui.nuxt.com'
