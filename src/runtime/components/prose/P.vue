<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/p'

type ProseP = ComponentConfig<typeof theme, AppConfig, 'p', 'ui.prose'>

export interface ProsePProps {
  class?: any
}

export interface ProsePSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProsePProps>()
defineSlots<ProsePSlots>()

const appConfig = useAppConfig() as ProseP['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.p || {}) }))
</script>

<template>
  <p :class="ui({ class: props.class })">
    <slot />
  </p>
</template>
