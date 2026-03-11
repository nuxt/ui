<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-shimmer'
import type { ComponentConfig } from '../types/tv'

type ChatShimmer = ComponentConfig<typeof theme, AppConfig, 'chatShimmer'>

export interface ChatShimmerProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  /**
   * The text to display with the shimmer effect.
   */
  text: string
  /**
   * The duration of the shimmer animation in seconds.
   * @defaultValue 2
   */
  duration?: number
  /**
   * The spread multiplier for the shimmer highlight. The actual spread is computed as `text.length * spread` in pixels.
   * @defaultValue 2
   */
  spread?: number
  class?: any
  ui?: ChatShimmer['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<ChatShimmerProps>(), {
  as: 'span',
  duration: 2,
  spread: 2
})

const appConfig = useAppConfig() as ChatShimmer['AppConfig']
const uiProp = useComponentUI('chatShimmer', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatShimmer || {}) }))

const spread = computed(() => props.text.length * props.spread)
</script>

<template>
  <Primitive
    :as="as"
    :style="{
      '--spread': `${spread}px`,
      '--duration': `${duration}s`
    }"
    data-slot="base"
    :class="ui({ class: [uiProp?.base, props.class] })"
  >
    {{ text }}
  </Primitive>
</template>
