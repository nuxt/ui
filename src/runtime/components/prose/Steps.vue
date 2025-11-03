<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/steps'

type ProseSteps = ComponentConfig<typeof theme, AppConfig, 'steps', 'ui.prose'>

export interface ProseStepsProps {
  /**
   * The heading level to apply to the steps.
   * @defaultValue '3'
   */
  level?: ProseSteps['variants']['level']
  class?: any
}

export interface ProseStepsSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'

const props = defineProps<ProseStepsProps>()
defineSlots<ProseStepsSlots>()

const appConfig = useAppConfig() as ProseSteps['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.steps || {}) }))
</script>

<template>
  <div :class="ui({ class: props.class, level: props.level })">
    <slot />
  </div>
</template>
