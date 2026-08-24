import type { H3Event } from 'h3'
import type { NitroErrorHandler } from 'nitropack/types'
import { MARKDOWN_VARY, errorMarkdown, prefersMarkdownError } from './utils/markdownNegotiation'

/**
 * Answers errors with a short markdown body when the client is asking for
 * markdown (explicit `Accept`, a known AI agent, a `.md` URL, or any
 * non-browser client requesting a page).
 *
 * Registered ahead of Nuxt's HTML error handler through the `nitro:config`
 * hook in `nuxt.config.ts`. Returning without writing a response hands the
 * error back to the chain, so browsers keep the HTML error page and API
 * clients keep the JSON payload.
 */
const errorHandler: NitroErrorHandler = async (error, event: H3Event, { defaultHandler }) => {
  if (event.handled || getRequestHeader(event, 'x-nuxt-error')) {
    return
  }

  if (!prefersMarkdownError({
    method: event.method,
    path: event.path,
    accept: getRequestHeader(event, 'accept'),
    userAgent: getRequestHeader(event, 'user-agent'),
    secFetchMode: getRequestHeader(event, 'sec-fetch-mode')
  })) {
    return
  }

  // Nitro's default handler is what logs unhandled errors, sets the status
  // and computes the hardening headers (`nosniff`, `x-frame-options`, ...).
  // Nuxt's HTML handler goes through it too, so keep the same behavior.
  const res = await defaultHandler(error, event, { json: true })
  const status = res.status || error.statusCode || 500

  for (const [name, value] of Object.entries(res.headers)) {
    if (name.toLowerCase() !== 'content-type') {
      setResponseHeader(event, name, value)
    }
  }

  setResponseStatus(event, status, res.statusText)
  setResponseHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'Vary', MARKDOWN_VARY)
  setResponseHeader(event, 'Cache-Control', 'no-cache')

  // A route can report the path the client asked for (see `/raw/**`, which
  // serves `/docs/**` pages) through `data.path`.
  const data = error.data as { path?: unknown } | undefined

  return send(event, errorMarkdown({
    path: typeof data?.path === 'string' ? data.path : event.path,
    status,
    statusMessage: error.statusMessage
  }))
}

export default defineNitroErrorHandler(errorHandler)
