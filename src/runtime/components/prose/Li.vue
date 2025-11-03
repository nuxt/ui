<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/li'

type ProseLi = ComponentConfig<typeof theme, AppConfig, 'li', 'ui.prose'>

export interface ProseLiProps {
  class?: any
}

export interface ProseLiSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseLiProps>()
defineSlots<ProseLiSlots>()

const appConfig = useAppConfig() as ProseLi['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.li || {}) }))
</script>

<template>
  <li :class="ui({ class: props.class })">
    <slot />
  </li>
</template>
