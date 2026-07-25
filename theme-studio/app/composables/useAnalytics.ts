/**
 * No-op analytics hook. Apps extending the layer that want telemetry
 * override this by defining their own `useAnalytics` composable — the
 * consuming app's declaration wins over the layer's (the docs wire it
 * to Vercel Analytics this way).
 */
export function useAnalytics() {
  return {
    track(..._args: unknown[]) {}
  }
}
