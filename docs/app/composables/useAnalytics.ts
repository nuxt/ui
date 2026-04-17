import { track } from '@vercel/analytics'

export function useAnalytics() {
  return {
    track
  }
}
