<script lang="ts">
import type * as ui from '#build/ui'
import type { TVConfig } from '../types/tv'
import { computed } from 'vue'
import { provideUTheme } from '../composables/useComponentUiTheme'

type UIConfig = TVConfig<typeof ui>

export interface ThemeProps {
  theme: UIConfig
}

export interface ThemeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
const props = defineProps<ThemeProps>()

const rootContext = computed(() => props.theme)
provideUTheme({
  theme: rootContext
})
</script>

<template>
  <slot />
</template>
