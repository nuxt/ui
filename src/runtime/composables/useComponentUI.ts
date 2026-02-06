import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import defu from 'defu'
import { createContext } from 'reka-ui'
import type { TVConfig } from '../types/tv'
import type * as ui from '#build/ui'
import { get } from '../utils'

type UIConfig = TVConfig<typeof ui>
type UIConfigEntry<T extends keyof UIConfig> = NonNullable<UIConfig[T]>
type UIConfigSlots<T extends keyof UIConfig> = UIConfigEntry<T> extends { slots?: infer S } ? S : Record<string, any>
export type ThemeRootContext = {
  ui: ComputedRef<UIConfig>
}

const [injectThemeContext, provideThemeContext] = createContext<ThemeRootContext>('UTheme', 'RootContext')

export { provideThemeContext }

type ComponentUiProps<T extends keyof UIConfig> = {
  ui?: UIConfigSlots<T>
}

export function useComponentUI<T extends keyof UIConfig>(name: T | (string & {}), props: ComponentUiProps<T>): ComputedRef<UIConfigSlots<T>> {
  const { ui } = injectThemeContext({ ui: computed(() => ({})) })

  return computed(() => {
    const themeEntry = (get(ui.value, name as string) || {}) as UIConfigEntry<T>
    const themeSlots = ('slots' in themeEntry ? (themeEntry as { slots?: UIConfigSlots<T> }).slots : undefined) || {}

    return defu(props.ui ?? {}, themeSlots) as UIConfigSlots<T>
  })
}
