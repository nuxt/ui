import type { ComputedRef } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import { computed } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import type { ComponentConfig, TVConfig } from '../types/tv'
import type * as ui from '#build/ui'
import { get } from '../utils'
import type { AppConfig } from '@nuxt/schema'

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

type ComponentVariants<C extends keyof UIConfig> = ComponentConfig<(typeof ui)[C], AppConfig, C>['variants']

type VariantValue<V> = [V] extends ['true' | 'false'] ? boolean : V
type ThemeVariantOverrides<T> = {
  [K in keyof T]?: VariantValue<T[K]>
}

type DefaultVariantKeys<T> = T extends { defaultVariants: infer D extends Record<string, any> } ? keyof D : never

export type ThemeVariants = {
  [K in keyof UIConfig]?: {
    [V in keyof ComponentVariants<K> as V extends DefaultVariantKeys<K extends keyof typeof ui ? (typeof ui)[K] : never> ? V : never]?: VariantValue<ComponentVariants<K>[V]>
  }
}

export type ThemeContext = {
  ui: ComputedRef<ThemeUI>
  variants: ComputedRef<ThemeVariants>
}

const [injectThemeContext, provideThemeContext] = createContext<ThemeContext>('UTheme', 'RootContext')

export { injectThemeContext, provideThemeContext }

type ComponentUIProps<T extends keyof UIConfig> = {
  ui?: UIConfigSlots<T>
}

export const defaultThemeContext: ThemeContext = { ui: computed(() => ({})), variants: computed(() => ({})) }

export function useComponentUI<T extends keyof UIConfig>(name: T, props: ComponentUIProps<T>): ComputedRef<UIConfigSlots<T>>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any>
export function useComponentUI(name: string, props: { ui?: any }): ComputedRef<any> {
  const { ui } = injectThemeContext(defaultThemeContext)

  return computed(() => {
    const themeOverrides = (get(ui.value, name as string) || {})

    return defu(props.ui ?? {}, themeOverrides)
  })
}

export function useComponentTheme<C extends keyof UIConfig>(name: C, props: ComponentUIProps<C>): {
  ui: ComputedRef<UIConfigSlots<C>>
  variants: ComputedRef<ThemeVariantOverrides<ComponentVariants<C>>>
}
export function useComponentTheme(name: string, props: { ui?: any }): {
  ui: ComputedRef<any>
  variants: ComputedRef<any>
}
export function useComponentTheme(name: string, props: { ui?: any }): {
  ui: ComputedRef<any>
  variants: ComputedRef<any>
} {
  const { ui, variants } = injectThemeContext(defaultThemeContext)

  return {
    ui: computed(() => {
      const themeOverrides = (get(ui.value, name as string) || {})
      return defu(props.ui ?? {}, themeOverrides)
    }),
    variants: computed(() => (get(variants.value, name as string) || {}))
  }
}
