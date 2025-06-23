<script lang="ts">
import { createContext } from 'reka-ui'
import type * as ui from '#build/ui'
import type { TVConfig } from '../types/tv'
import { type ComputedRef, computed, toValue } from 'vue'
import defu from 'defu'
import type { RefOrGetter } from '../types/utils'

type UIConfig = TVConfig<typeof ui>

type ThemeRootContext = {
  theme: ComputedRef<UIConfig>
}

export interface ThemeProps {
  theme: UIConfig
}

export interface ThemeSlots {
  default(props?: {}): any
}

const [inject, provide] = createContext<ThemeRootContext>('UTheme', 'RootContext')

export function useComponentUiTheme<TName extends keyof UIConfig>(name: TName, ui: RefOrGetter<UIConfig[TName]>): ComputedRef<UIConfig[TName]> {
  const { theme } = inject({ theme: computed(() => ({})) })
  return computed(() => {
    return defu(toValue(ui) ?? {}, theme.value[name] || {})
  })
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

const rootContext = computed(() => props.theme)
provide({
  theme: rootContext
})
</script>

<template>
  <slot />
</template>
