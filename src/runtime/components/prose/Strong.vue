<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/strong'

type ProseStrong = ComponentConfig<typeof theme, AppConfig, 'strong', 'ui.prose'>

export interface ProseStrongProps {
  class?: any
}

export interface ProseStrongSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseStrongProps>()
defineSlots<ProseStrongSlots>()

const appConfig = useAppConfig() as ProseStrong['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.strong || {}) }))
</script>

<template>
  <strong :class="ui({ class: props.class })">
    <slot />
  </strong>
</template>
