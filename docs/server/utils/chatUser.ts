import { getCookie, setCookie } from 'nuxt/server'
import type { RequestEvent } from 'nuxt/server'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'nuxt-ui-chat-user'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/**
 * Anonymous, per-browser identifier passed to the AI Gateway as `user` so usage can be
 * attributed and grouped in the Gateway dashboard.
 *
 * Attribution only, not an abuse control. The cookie is client-controlled, so a caller can
 * drop it and get a fresh id on every request, and signing it wouldn't help since the id can
 * still be rotated. Gateway per-user limits keyed on this only bound honest traffic. Real
 * throttling has to be enforced server-side on something the caller can't rotate.
 */
export function getChatUser(_event: RequestEvent | H3Event): string {
  // `api/ai.post.ts` still runs on h3 for `event.node`. The cookie helpers accept both events
  // on Nitro 2, where the `nuxt/server` event wraps the h3 one.
  const event = _event as RequestEvent
  const existing = getCookie(event, COOKIE_NAME)
  if (existing && UUID_RE.test(existing)) {
    return existing
  }

  const id = crypto.randomUUID()

  setCookie(event, COOKIE_NAME, id, {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    path: '/'
  })

  return id
}
