<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chat-shimmer'
import type { ComponentConfig } from '../types/tv'

type ChatShimmer = ComponentConfig<typeof theme, AppConfig, 'chatShimmer'>

export interface ChatShimmerProps {
  /**
   * The text content to display with shimmer effect.
   */
  text: string
  /**
   * The element this component should render as.
   * @defaultValue 'span'
   */
  as?: string
  /**
   * The duration of the shimmer animation in seconds.
   * @defaultValue 2
   */
  duration?: number
  /**
   * The spread of the shimmer effect in pixels per character.
   * @defaultValue 2
   */
  spread?: number
  class?: any
  ui?: ChatShimmer['slots']
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<ChatShimmerProps>(), {
  as: 'span',
  duration: 2,
  spread: 2
})

const appConfig = useAppConfig() as ChatShimmer['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chatShimmer || {}) })())

const dynamicSpread = computed(() => props.text.length * props.spread)

const shimmerStyle = computed(() => ({
  '--spread': `${dynamicSpread.value}px`,
  'background-image': 'var(--bg), linear-gradient(var(--color-neutral-500), var(--color-neutral-500))'
} as Record<string, string>))
</script>

<template>
  <component
    :is="(motion as any)[as]"
    :initial="{ backgroundPosition: '100% center' }"
    :animate="{ backgroundPosition: '0% center' }"
    :transition="{
      repeat: Infinity,
      duration,
      ease: 'linear'
    }"
    :style="shimmerStyle"
    data-slot="base"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    class="[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-neutral-100),#0000_calc(50%+var(--spread)))]"
  >
    {{ text }}
  </component>
</template>
