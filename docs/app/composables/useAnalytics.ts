import { track as vercelTrack } from '@vercel/analytics'

// Sliders and curve drags stream through the theme setters at drag frequency.
// One clock per event and setting, shared by every caller, so a drag is one
// event no matter which component reports it, and a different interaction
// inside the same two seconds is still its own event. Client only: the
// module scope would otherwise be shared across SSR requests.
const trackedAt = new Map<string, number>()

// Depth of `untracked` calls in progress. Client only, like the clock above.
let muted = 0

function track(...args: Parameters<typeof vercelTrack>) {
  if (muted) return
  vercelTrack(...args)
}

/** `track`, at most once per two-second burst of the same event and setting. */
function trackThrottled(...args: Parameters<typeof vercelTrack>) {
  if (import.meta.server || muted) return
  const [event, properties] = args
  const key = `${event}:${(properties as Record<string, unknown> | undefined)?.setting ?? ''}`
  const last = trackedAt.get(key)
  if (!last || Date.now() - last > 2000) {
    trackedAt.set(key, Date.now())
    vercelTrack(...args)
  }
}

/** Run `fn` without sending events, for changes the user hasn't made yet (theme previews). */
function untracked<T>(fn: () => T): T {
  muted++
  try {
    return fn()
  } finally {
    muted--
  }
}

export function useAnalytics() {
  return {
    track,
    trackThrottled,
    untracked
  }
}
