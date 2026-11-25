import type { Ref } from 'vue'
import { createContext } from 'reka-ui'

export interface HeaderContext {
  open: Ref<boolean>
  /**
   * The `<header>` element, the inline menu opens under it.
   */
  root: Ref<HTMLElement | undefined>
}

export const [injectHeaderContext, provideHeaderContext] = createContext<HeaderContext>('Header')
