<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/code'

type ProseCode = ComponentConfig<typeof theme, AppConfig, 'code', 'ui.prose'>

export interface ProseCodeProps {
  lang?: string
  /**
   * @defaultValue 'neutral'
   */
  color?: ProseCode['variants']['color']
  class?: any
}

export interface ProseCodeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseCodeProps>()
defineSlots<ProseCodeSlots>()

const appConfig = useAppConfig() as ProseCode['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.code || {}) }))
</script>

<template>
  <code :class="ui({ class: (props.class || '').split(',').join(' '), color: props.color })">
    <slot />
  </code>
</template>
