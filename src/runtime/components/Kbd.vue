<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/kbd'
import type { KbdKey } from '../composables/useKbd'
import type { ComponentConfig } from '../types/utils'

type Kbd = ComponentConfig<typeof theme, AppConfig, 'kbd'>

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: any
  value?: KbdKey | string
  /**
   * @defaultValue 'outline'
   */
  variant?: Kbd['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Kbd['variants']['size']
  class?: any
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

const props = withDefaults(defineProps<KbdProps>(), {
  as: 'kbd'
})
defineSlots<KbdSlots>()

const { getKbdKey } = useKbd()
const appConfig = useAppConfig() as Kbd['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) }))
</script>

<template>
  <Primitive :as="as" :class="ui({ variant, size, class: props.class })">
    <slot>
      {{ getKbdKey(value) }}
    </slot>
  </Primitive>
</template>
