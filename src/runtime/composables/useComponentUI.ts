import type { ComputedRef } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import { computed } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import type { TVConfig } from '../types/tv'
import type * as ui from '#build/ui'
import { get } from '../utils'

type UIConfig = TVConfig<typeof ui>
type ExtractUISlots<C> = C extends { slots?: infer S } ? NonNullable<S> : never
type UIConfigSlots<T extends keyof UIConfig>
  = 'slots' extends keyof NonNullable<UIConfig[T]>
    ? ExtractUISlots<NonNullable<UIConfig[T]>>
    : { base?: ClassValue }

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

type ComponentUIProps<T extends keyof UIConfig> = {
  ui?: UIConfigSlots<T>
}

export function useComponentUI<T extends keyof UIConfig>(name: T, props: ComponentUIProps<T>): ComputedRef<UIConfigSlots<T>>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any> {
  const { ui } = injectThemeContext({ ui: computed(() => ({})) })

  return computed(() => {
    const themeOverrides = (get(ui.value, name as string) || {})

    return defu(props.ui ?? {}, themeOverrides)
  })
}
