<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/steps'

type ProseSteps = ComponentConfig<typeof theme, AppConfig, 'steps', 'ui.prose'>

export interface ProseStepsProps {
  /**
   * The heading level to apply to the steps.
   * @defaultValue '3'
   */
  level?: ProseSteps['variants']['level']
  class?: any
  ui?: ProseSteps['slots']
}

export interface ProseStepsSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseStepsProps>()

defineSlots<ProseStepsSlots>()

const props = useComponentProps('prose.steps', _props, theme)

const appConfig = useThemeConfig() as ProseSteps['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.prose?.steps)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({ level: props.level }))
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot />
  </div>
</template>
