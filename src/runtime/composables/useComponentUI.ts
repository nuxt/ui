import type { ComputedRef } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import { computed } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import type { TVConfig } from '../types/tv'
import type * as ui from '#build/ui'
import { get } from '../utils'

type UIConfig = TVConfig<typeof ui>
type UIConfigSlots<T extends keyof UIConfig> = NonNullable<UIConfig[T]> extends { slots?: infer S } ? S : Record<string, any>

type ThemeSlotOverrides<T> = T extends { slots: infer S extends Record<string, any> }
  ? { [K in keyof S]?: ClassValue }
  : { [K in keyof T]?: T[K] extends Record<string, any> ? ThemeSlotOverrides<T[K]> : ClassValue }

export type ThemeUI = {
  [K in keyof typeof ui]?: ThemeSlotOverrides<(typeof ui)[K]>
}

export type ThemeRootContext = {
  ui: ComputedRef<ThemeUI>
}

const [injectThemeContext, provideThemeContext] = createContext<ThemeRootContext>('UTheme', 'RootContext')

export { provideThemeContext }

type ComponentUiProps<T extends keyof UIConfig> = {
  ui?: UIConfigSlots<T>
}

export function useComponentUI<T extends keyof UIConfig>(name: T | (string & {}), props: ComponentUiProps<T>): ComputedRef<UIConfigSlots<T>> {
  const { ui } = injectThemeContext({ ui: computed(() => ({})) })

  return computed(() => {
    const themeOverrides = (get(ui.value, name as string) || {}) as UIConfigSlots<T>

    return defu(props.ui ?? {} as Record<string, any>, themeOverrides as Record<string, any>) as UIConfigSlots<T>
  })
}
