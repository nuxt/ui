<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/tr'

type ProseTr = ComponentConfig<typeof theme, AppConfig, 'tr', 'ui.prose'>

export interface ProseTrProps {
  class?: any
}

export interface ProseTrSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTrProps>()
defineSlots<ProseTrSlots>()

const appConfig = useAppConfig() as ProseTr['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.tr || {}) }))
</script>

<template>
  <tr :class="ui({ class: props.class })">
    <slot />
  </tr>
</template>
