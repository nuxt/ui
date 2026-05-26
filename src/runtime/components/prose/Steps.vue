<script lang="ts">
import type { VNode } from 'vue'
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
  ui?: { base?: any }
}

export interface ProseStepsSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseStepsProps>()

defineSlots<ProseStepsSlots>()

const props = useComponentProps('prose.steps', _props)

const appConfig = useAppConfig() as ProseSteps['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.steps || {}) }))
</script>

<template>
  <div :class="ui({ class: [props.ui?.base, props.class], level: props.level })">
    <slot />
  </div>
</template>
