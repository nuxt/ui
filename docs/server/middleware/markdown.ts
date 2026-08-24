import { MARKDOWN_VARY, negotiatedRawPath } from '../utils/markdownNegotiation'

/**
 * Serves markdown through content negotiation on the Nitro server.
 *
 * In production the same negotiation happens at the Vercel edge
 * (`modules/md-rewrite.ts`), before the filesystem is consulted. Those rewrites
 * don't exist in dev or on a plain Node server, so this covers `/docs/**.md`
 * URLs, `Accept: text/markdown` and known AI agents there, and answers unknown
 * documentation pages with the markdown 404 from `/raw/**`.
 *
 * Caveat: Nitro unshifts its static asset handler ahead of every user handler
 * when it generates the handler list, so a request that matches a prerendered
 * file is served before this middleware runs. On a built Node server
 * `/docs/components/button` therefore stays HTML, while `.md` URLs and pages
 * that were never prerendered come through here. In dev nothing is
 * prerendered, so every path is negotiated.
 */
export default defineEventHandler(async (event) => {
  if (import.meta.prerender) {
    return
  }

  if (event.method !== 'GET' && event.method !== 'HEAD') {
    return
  }

  const rawPath = negotiatedRawPath(event.path, {
    accept: getRequestHeader(event, 'accept'),
    userAgent: getRequestHeader(event, 'user-agent')
  })

  if (!rawPath) {
    return
  }

  const headers: Record<string, string> = { accept: 'text/markdown' }

  // Let the raw handler (or the static file) answer conditional requests.
  for (const name of ['if-none-match', 'if-modified-since']) {
    const value = getRequestHeader(event, name)
    if (value) {
      headers[name] = value
    }
  }

  const response = await useNitroApp().localFetch(rawPath, { headers })

  // The inner request has already handled and logged the original failure
  // against the `/raw/**` path; rethrowing reports the status on the path the
  // client asked for and keeps its `Cache-Control: no-cache`.
  if (response.status >= 500) {
    throw createError({ statusCode: response.status, statusMessage: response.statusText })
  }

  setResponseHeader(event, 'Vary', MARKDOWN_VARY)

  for (const name of ['cache-control', 'etag', 'last-modified', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'content-security-policy']) {
    const value = response.headers.get(name)
    if (value) {
      setResponseHeader(event, name, value)
    }
  }

  // A 304 carries only validators and cache metadata, no representation headers.
  if (response.status === 304) {
    return sendNoContent(event, 304)
  }

  setResponseStatus(event, response.status)
  setResponseHeader(event, 'Content-Type', response.headers.get('content-type') || 'text/markdown; charset=utf-8')

  // Keep the canonical/alternate links the raw handlers set on this response.
  const link = response.headers.get('link')
  if (link) {
    appendResponseHeader(event, 'Link', link)
  }

  return await response.text()
})
