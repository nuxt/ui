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
   * The label to display with the shimmer effect.
   */
  label: string
  /**
   * The duration of the shimmer animation in seconds.
   * @defaultValue 2
   */
  duration?: number
  /**
   * The spread multiplier for the shimmer highlight. The actual spread is computed as `label.length * spread` in pixels.
   * @defaultValue 2
   */
  spread?: number
  class?: any
  ui?: ChatShimmer['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
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

const initial = { backgroundPosition: '100% center' }
const animate = { backgroundPosition: '0% center' }

const transition = computed(() => ({ repeat: Infinity, duration: props.duration, ease: 'linear' as const }))

const dynamicSpread = computed(() => props.label.length * props.spread)
</script>

<template>
  <Motion
    :as="as"
    :initial="initial"
    :animate="animate"
    :transition="transition"
    :style="{ '--spread': `${dynamicSpread}px` }"
    data-slot="base"
    :class="ui({ class: [uiProp?.base, props.class] })"
  >
    {{ label }}
  </Motion>
</template>
