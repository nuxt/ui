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

  const response = await useNitroApp().localFetch(rawPath, {
    headers: {
      'accept': 'text/markdown',
      // Let the raw handler (or the static file) answer conditional requests.
      'if-none-match': getRequestHeader(event, 'if-none-match') || '',
      'if-modified-since': getRequestHeader(event, 'if-modified-since') || ''
    }
  })

  // Surface server errors on this request, so they are logged and reported
  // against the path the client asked for rather than the `/raw/**` one.
  if (response.status >= 500) {
    throw createError({ statusCode: response.status, statusMessage: response.statusText })
  }

  setResponseStatus(event, response.status)
  setResponseHeader(event, 'Content-Type', response.headers.get('content-type') || 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Vary', MARKDOWN_VARY)

  for (const name of ['cache-control', 'etag', 'last-modified']) {
    const value = response.headers.get(name)
    if (value) {
      setResponseHeader(event, name, value)
    }
  }

  // Keep the discovery links the routeRules already set on this response.
  const link = response.headers.get('link')
  if (link) {
    appendResponseHeader(event, 'Link', link)
  }

  if (response.status === 304) {
    return sendNoContent(event, 304)
  }

  return await response.text()
})
