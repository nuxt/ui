import { createContext } from 'reka-ui'
import type * as ui from '#build/ui'
import type { TVConfig } from '../types/tv'
import { type ComputedRef, computed, toValue } from 'vue'
import defu from 'defu'
import type { RefOrGetter } from '../types/utils'

type UIConfig = TVConfig<typeof ui>
export type ThemeRootContext = {
  theme: ComputedRef<UIConfig>
}

const [inject, provide] = createContext<ThemeRootContext>('UTheme', 'RootContext')

export const provideUTheme = provide

export function useComponentUiTheme<TName extends keyof UIConfig>(name: TName, ui: RefOrGetter<UIConfig[TName]>): ComputedRef<UIConfig[TName]> {
  const { theme } = inject({ theme: computed(() => ({})) })
  return computed(() => {
    return defu(toValue(ui) ?? {}, theme.value[name] || {})
  })
}
