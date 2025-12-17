<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/marquee'
import type { ComponentConfig } from '../types/tv'

type Marquee = ComponentConfig<typeof theme, AppConfig, 'marquee'>

export interface MarqueeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Pause the marquee on hover.
   * @defaultValue false
   */
  pauseOnHover?: boolean
  /**
   * Reverse the direction of the marquee.
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * The orientation of the marquee.
   * @defaultValue 'horizontal'
   */
  orientation?: Marquee['variants']['orientation']
  /**
   * The number of times the marquee should repeat.
   * @defaultValue 4
   */
  repeat?: number
  /**
   * Display an overlay on the marquee.
   * @defaultValue true
   */
  overlay?: boolean
  class?: any
  ui?: Marquee['slots']
}

export interface MarqueeSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<MarqueeProps>(), {
  orientation: 'horizontal',
  repeat: 4,
  overlay: true
})
defineSlots<MarqueeSlots>()

const appConfig = useAppConfig() as Marquee['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.marquee || {}) })({
  pauseOnHover: props.pauseOnHover,
  orientation: props.orientation,
  reverse: props.reverse,
  overlay: props.overlay
}))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-for="i in repeat" :key="i" data-slot="content" :class="ui.content({ class: [props.ui?.content] })">
      <slot />
    </div>
  </Primitive>
</template>
