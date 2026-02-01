import { createContext } from 'reka-ui'
import type * as ui from '#build/ui'
import type { TVConfig } from '../types/tv'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import defu from 'defu'

type UIConfig = TVConfig<typeof ui>
type UIConfigEntry<TName extends keyof UIConfig> = NonNullable<UIConfig[TName]>
type UIConfigSlots<TName extends keyof UIConfig> = UIConfigEntry<TName> extends { slots?: infer S } ? S : Record<string, any>
export type ThemeRootContext = {
  theme: ComputedRef<UIConfig>
}

const [inject, provide] = createContext<ThemeRootContext>('UTheme', 'RootContext')

export const provideUTheme = provide

type ComponentUiProps<TName extends keyof UIConfig> = {
  ui?: UIConfigSlots<TName>
}

export function useComponentUI<TName extends keyof UIConfig>(name: TName, props: ComponentUiProps<TName>): ComputedRef<UIConfigSlots<TName>> {
  const { theme } = inject({ theme: computed(() => ({})) })
  return computed(() => {
    const themeEntry = (theme.value[name] || {}) as UIConfigEntry<TName>
    const themeSlots = ('slots' in themeEntry ? (themeEntry as { slots?: UIConfigSlots<TName> }).slots : undefined) || {}
    return defu(props.ui ?? {}, themeSlots) as UIConfigSlots<TName>
  })
}
