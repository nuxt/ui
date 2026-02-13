import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import type { ComponentConfig, TVConfig } from '../types/tv'
import type * as ui from '#build/ui'
import { get } from '../utils'
import type { AppConfig } from '@nuxt/schema'

type UIConfig = TVConfig<typeof ui>
type ComponentVariants<C extends keyof UIConfig> = ComponentConfig<(typeof ui)[C], AppConfig, C>['variants']

type VariantValue<V> = [V] extends ['true' | 'false'] ? boolean : V
type ThemeVariantOverrides<T> = {
    [K in keyof T]?: VariantValue<T[K]>
};

export type ThemeVariantContext = {
  variant: ComputedRef<VariantUI>
}

export type VariantUI = {
    [K in keyof UIConfig]?: ThemeVariantOverrides<ComponentVariants<K>>
}

const [injectVariantContext, provideVariantContext] = createContext<ThemeVariantContext>('UThemeVariant', 'RootContext')

export { provideVariantContext }

type ComponentVariantProps<C extends keyof UIConfig> = ThemeVariantOverrides<ComponentVariants<C>>

export function useComponentVariant<C extends keyof UIConfig>(name: C, props: ComponentVariantProps<C>): ComputedRef<ThemeVariantOverrides<ComponentVariants<C>>> {
  const { variant } = injectVariantContext({ variant: computed(() => ({})) })

  return computed(() => {
    const themeOverrides = (get(variant.value, name as string) || {})

    return defu(props.variants ?? {}, themeOverrides)
  })
}
