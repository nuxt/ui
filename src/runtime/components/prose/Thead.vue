<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/thead'

type ProseThead = ComponentConfig<typeof theme, AppConfig, 'thead', 'ui.prose'>

export interface ProseTheadProps {
  class?: any
}

export interface ProseTheadSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseTheadProps>()
defineSlots<ProseTheadSlots>()

const appConfig = useAppConfig() as ProseThead['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.thead || {}) }))
</script>

<template>
  <thead :class="ui({ class: props.class })">
    <slot />
  </thead>
</template>
