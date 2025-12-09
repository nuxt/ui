<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tbody'

type ProseTbody = ComponentConfig<typeof theme, AppConfig, 'tbody', 'ui.prose'>

export interface ProseTbodyProps {
  class?: any
}

export interface ProseTbodySlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTbodyProps>()
defineSlots<ProseTbodySlots>()

const appConfig = useAppConfig() as ProseTbody['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tbody || {}) }))
</script>

<template>
  <tbody :class="ui({ class: props.class })">
    <slot />
  </tbody>
</template>
