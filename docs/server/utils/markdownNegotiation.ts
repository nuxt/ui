/**
 * Shared markdown content negotiation helpers.
 *
 * Kept dependency-free on purpose: this module is imported by the build-time
 * Nuxt module (`modules/md-rewrite.ts`, loaded through jiti) and auto-imported
 * in the Nitro server bundle.
 */

export const SITE_URL = 'https://ui.nuxt.com'

/** Request headers the markdown representation depends on. */
export const MARKDOWN_VARY = 'Accept, User-Agent'

/**
 * Agent discovery links advertised on the homepage (RFC 8288, RFC 9727).
 * Shared by the `/` routeRule and the Vercel rewrite route so agents that are
 * served the markdown homepage get the same header as browsers.
 */
export const AGENT_LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</sitemap.md>; rel="sitemap"; type="text/markdown"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/mcp/server-card.json>; rel="service-desc"; type="application/json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</docs>; rel="service-doc"; type="text/html"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</llms-full.txt>; rel="describedby"; type="text/plain"',
  '</>; rel="alternate"; type="text/markdown"'
].join(', ')

/** User agents we serve markdown to without an explicit `Accept` header. */
const AGENT_USER_AGENTS = [
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'Google-CloudVertexBot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'PerplexityBot',
  'YouBot',
  'DeepSeekBot',
  'Amazonbot',
  'cohere-ai',
  'AI2Bot',
  'Applebot-Extended',
  'Bytespider'
]

/** `has` matcher for the Vercel Build Output API, which anchors the value. */
const AGENT_UA_PATTERN = `.*(${AGENT_USER_AGENTS.join('|')}).*`

/** Paths owned by the framework or the API, never markdown. */
const NON_MARKDOWN_PREFIXES = ['/_', '/api/', '/mcp']

/** Case-sensitive on purpose, so it agrees with the Vercel `has` matcher. */
function isAgentUserAgent(userAgent?: string | null): boolean {
  if (!userAgent) {
    return false
  }

  return AGENT_USER_AGENTS.some(agent => userAgent.includes(agent))
}

function acceptsMarkdown(accept?: string | null): boolean {
  return !!accept?.toLowerCase().includes('text/markdown')
}

function acceptsHtml(accept?: string | null): boolean {
  return !!accept?.toLowerCase().includes('text/html')
}

/** Drops the query string and any trailing slash, keeping the root as `/`. */
function normalizePathname(path: string): string {
  const pathname = (path || '/').split('?')[0]!.split('#')[0]!
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname || '/'
}

function hasFileExtension(pathname: string): boolean {
  const segment = pathname.slice(pathname.lastIndexOf('/') + 1)
  return segment.includes('.')
}

/**
 * Resolves the `/raw/**.md` handler a request should be served from, or
 * `undefined` when the request is not asking for markdown.
 *
 * Mirrors the Vercel rewrites in `modules/md-rewrite.ts` so the Node server and
 * the dev server behave like the edge.
 */
export function negotiatedRawPath(path: string, options: { accept?: string | null, userAgent?: string | null } = {}): string | undefined {
  const pathname = normalizePathname(path)

  if (pathname.startsWith('/raw/')) {
    return undefined
  }

  const wantsMarkdown = acceptsMarkdown(options.accept) || isAgentUserAgent(options.userAgent)

  if (pathname === '/') {
    return wantsMarkdown ? '/raw/index.md' : undefined
  }

  if (!pathname.startsWith('/docs/')) {
    return undefined
  }

  // `/docs/**.md` is an explicit markdown request, whatever the headers say.
  if (pathname.endsWith('.md')) {
    return `/raw${pathname}`
  }

  // Any other dotted path is an asset (`_payload.json`, images), not a page.
  if (hasFileExtension(pathname)) {
    return undefined
  }

  return wantsMarkdown ? `/raw${pathname}.md` : undefined
}

/**
 * Whether an error response should be rendered as markdown rather than the
 * HTML error page (or the JSON payload Nitro falls back to).
 */
export function prefersMarkdownError(options: {
  method?: string
  path: string
  accept?: string | null
  userAgent?: string | null
  secFetchMode?: string | null
}): boolean {
  const method = (options.method || 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    return false
  }

  const pathname = normalizePathname(options.path)

  if (pathname.startsWith('/raw/')) {
    return true
  }

  // The API and framework surfaces keep their JSON errors, `.md` or not.
  if (NON_MARKDOWN_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return false
  }

  // Explicit markdown URLs.
  if (pathname.endsWith('.md')) {
    return true
  }

  // Assets and non-page documents: images, `.xml`, `.json`, `.js`, ...
  if (hasFileExtension(pathname)) {
    return false
  }

  if (acceptsMarkdown(options.accept)) {
    return true
  }

  if (isAgentUserAgent(options.userAgent)) {
    return true
  }

  if (acceptsHtml(options.accept)) {
    return false
  }

  if (options.accept?.toLowerCase().includes('application/json')) {
    return false
  }

  // A browser `fetch()` of any mode (`cors`, `no-cors`, `same-origin`) keeps
  // the HTML or JSON error it was written against. Only navigations fall through.
  if (options.secFetchMode && options.secFetchMode.toLowerCase() !== 'navigate') {
    return false
  }

  // `*/*`, an empty `Accept`, curl, or any other non-browser client asking for
  // a page: markdown is the most useful thing we can hand back.
  return true
}

/**
 * Short markdown body for an error response, pointing agents at the entry
 * points they can recover from. Links are absolute so they resolve wherever
 * the body ends up.
 */
const STATUS_TEXT: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Page Not Found',
  405: 'Method Not Allowed',
  410: 'Gone',
  429: 'Too Many Requests'
}

export function errorMarkdown(options: { path: string, status?: number, statusMessage?: string }): string {
  const status = options.status || 404
  // The pathname is attacker-chosen and lands in a code span of a document
  // written for agents, so drop anything that could close the span or smuggle
  // markdown in.
  const pathname = normalizePathname(options.path).replace(/[`\\]/g, '')
  // Server errors never surface their message. Client errors use the status
  // message when there is one, stripped of anything that could break the
  // heading or the frontmatter line.
  const statusMessage = status < 500
    ? options.statusMessage?.replace(/[\r\n\t`\\]+/g, ' ').trim()
    : undefined
  const title = status === 404
    ? STATUS_TEXT[404]!
    : statusMessage || STATUS_TEXT[status] || (status < 500 ? 'Request Error' : 'Server Error')

  const intro = status === 404
    ? `The page \`${pathname}\` does not exist on ${SITE_URL}.`
    : `The request for \`${pathname}\` failed with status ${status}.`

  return [
    '---',
    `title: ${JSON.stringify(title)}`,
    `status: ${status}`,
    '---',
    '',
    `# ${status} ${title}`,
    '',
    intro,
    '',
    '## Where to look next',
    '',
    `- [Sitemap (Markdown)](${SITE_URL}/sitemap.md): every page on the site`,
    `- [Sitemap (XML)](${SITE_URL}/sitemap.xml)`,
    `- [llms.txt](${SITE_URL}/llms.txt): index of the documentation for LLMs`,
    `- [Documentation home](${SITE_URL}/raw/docs/getting-started.md)`,
    `- [Homepage](${SITE_URL}/raw/index.md)`,
    `- [OpenAPI specification](${SITE_URL}/openapi.json): machine-readable API surface`,
    `- [MCP server card](${SITE_URL}/.well-known/mcp/server-card.json): MCP endpoint at ${SITE_URL}/mcp`,
    '',
    '## Fetching markdown',
    '',
    'Any documentation page is available as markdown: append `.md` to its URL',
    '(`/docs/components/button.md`) or send `Accept: text/markdown`.',
    ''
  ].join('\n')
}

/**
 * Routes prepended to `.vercel/output/config.json` (Build Output API v3) to
 * serve markdown through content negotiation.
 *
 * The `Vary` route must come first and carry `continue: true`: Nitro emits its
 * own `routeRules` header routes *after* these rewrites and without
 * `continue`, so they never run for a request that gets rewritten to a
 * prerendered `/raw/**.md` file.
 */
export function vercelMarkdownRoutes() {
  return [
    // Tell CDNs the response depends on `Accept` / `User-Agent`, then keep routing.
    {
      src: '^/(docs/.*)?$',
      headers: { Vary: MARKDOWN_VARY },
      continue: true
    },
    // The `/` routeRule carries the same header, but a homepage request
    // rewritten below to the prerendered `/raw/index.md` never reaches it.
    {
      src: '^/$',
      headers: { Link: AGENT_LINK_HEADER },
      continue: true
    },
    // Rewrite /docs/*.md URLs to the raw markdown handler
    {
      src: '^/docs/(.*)\\.md$',
      dest: '/raw/docs/$1.md'
    },
    // Serve markdown for the homepage when Accept: text/markdown is requested.
    // `check: true` looks the destination up in the filesystem first, which is
    // where the prerendered `/raw/index.md` lives.
    {
      src: '^/$',
      dest: '/raw/index.md',
      has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
      check: true
    },
    // Serve markdown for the homepage to known AI agent user agents
    {
      src: '^/$',
      dest: '/raw/index.md',
      has: [{ type: 'header', key: 'user-agent', value: AGENT_UA_PATTERN }],
      check: true
    },
    // Serve markdown when Accept: text/markdown is requested. The negative
    // lookahead keeps `.md` URLs on the rewrite above: without it, production
    // traces showed `.md` URLs with a negotiated Accept or agent user agent
    // reaching the Nuxt function with the original URL and answering the 404
    // HTML page.
    {
      src: '^/docs/(?!.*\\.md$)(.*)$',
      dest: '/raw/docs/$1.md',
      has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
      check: true
    },
    // Serve markdown to known AI agent user agents
    {
      src: '^/docs/(?!.*\\.md$)(.*)$',
      dest: '/raw/docs/$1.md',
      has: [{ type: 'header', key: 'user-agent', value: AGENT_UA_PATTERN }],
      check: true
    }
  ]
}
