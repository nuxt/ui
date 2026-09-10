import { track } from '@vercel/analytics'

// Sliders and curve drags stream through the theme setters at drag frequency.
// One clock per event and setting, shared by every caller, so a drag is one
// event no matter which component reports it, and a different interaction
// inside the same two seconds is still its own event. Client only: the
// module scope would otherwise be shared across SSR requests.
const trackedAt = new Map<string, number>()

/** `track`, at most once per two-second burst of the same event and setting. */
function trackThrottled(...args: Parameters<typeof track>) {
  if (import.meta.server) return
  const [event, properties] = args
  const key = `${event}:${(properties as Record<string, unknown> | undefined)?.setting ?? ''}`
  const last = trackedAt.get(key)
  if (!last || Date.now() - last > 2000) {
    trackedAt.set(key, Date.now())
    track(...args)
  }
}

export function useAnalytics() {
  return {
    track,
    trackThrottled
  }
}
