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
  pauseOnHover?: boolean
  reverse?: boolean
  orientation?: Marquee['variants']['orientation']
  repeat?: number
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
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-for="i in repeat" :key="i" :class="ui.content({ class: [props.ui?.content] })">
      <slot />
    </div>
  </Primitive>
</template>

<style>
@keyframes marquee {
  from { transform: translate3d(0, 0, 0); will-change: transform; }
  to { transform: translate3d(calc(-100% - var(--gap)), 0, 0); will-change: transform; }
}

@keyframes marquee-rtl {
  from { transform: translate3d(calc(100%), 0, 0); will-change: transform; }
  to { transform: translate3d(calc(-100% * var(--repeat) - var(--gap) * var(--repeat)), 0, 0); will-change: transform; }
}

@keyframes marquee-vertical {
  from { transform: translate3d(0, 0, 0); will-change: transform; }
  to { transform: translate3d(0, calc(-100% - var(--gap)), 0); will-change: transform; }
}

@keyframes marquee-vertical-rtl {
  from { transform: translate3d(0, calc(100%), 0); will-change: transform; }
  to { transform: translate3d(0, calc(-100% * var(--repeat) - var(--gap) * var(--repeat)), 0); will-change: transform; }
}
</style>
