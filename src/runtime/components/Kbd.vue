<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/kbd'
import type { KbdKey } from '../composables/useKbd'
import type { ComponentConfig } from '../types/tv'

type Kbd = ComponentConfig<typeof theme, AppConfig, 'kbd'>

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: any
  value?: KbdKey | string
  /**
   * @defaultValue 'neutral'
   */
  color?: Kbd['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Kbd['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Kbd['variants']['size']
  class?: any
  ui?: { base?: any }
}

export interface KbdSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useKbd } from '../composables/useKbd'
import { tv } from '../utils/tv'
import { useComponentUI } from '../composables/useComponentUI'

const props = withDefaults(defineProps<KbdProps>(), {
  as: 'kbd'
})
defineSlots<KbdSlots>()

const { getKbdKey } = useKbd()
const appConfig = useAppConfig() as Kbd['AppConfig']
const uiProp = useComponentUI('kbd', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ class: [uiProp?.base, props.class], color: props.color, variant: props.variant, size: props.size })">
    <slot>
      {{ getKbdKey(value) }}
    </slot>
  </Primitive>
</template>
