<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/button-group'
import type { ComponentConfig } from '../types/utils'

type ButtonGroup = ComponentConfig<typeof theme, AppConfig, 'buttonGroup'>

export interface ButtonGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: ButtonGroup['variants']['size']
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: ButtonGroup['variants']['orientation']
  class?: any
  ui?: ButtonGroup['slots']
}

export interface ButtonGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { buttonGroupInjectionKey } from '../composables/useButtonGroup'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<ButtonGroupSlots>()

const appConfig = useAppConfig() as ButtonGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.buttonGroup || {}) }))

provide(buttonGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" :class="ui({ orientation, class: props.class })">
    <slot />
  </Primitive>
</template>
