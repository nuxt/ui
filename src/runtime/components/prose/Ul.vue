<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/ul'

type ProseUl = ComponentConfig<typeof theme, AppConfig, 'ul', 'ui.prose'>

export interface ProseUlProps {
  class?: any
}

export interface ProseUlSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseUlProps>()
defineSlots<ProseUlSlots>()

const appConfig = useAppConfig() as ProseUl['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.ul || {}) }))
</script>

<template>
  <ul :class="ui({ class: props.class })">
    <slot />
  </ul>
</template>
