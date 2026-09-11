import type { Direction } from '@nuxt/ui'
import { pg } from './pg'

export default defineAppConfig({
  dir: 'ltr' as Direction,
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true,
    disableSwipe: false
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    // Playground layout authored as Tailwind; the StyleX engine compiles these
    // strings at build time. Vue templates bind the compiled hashes via usePg().
    pg
  }
})
