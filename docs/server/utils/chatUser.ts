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
export function getChatUser(event: H3Event): string {
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
