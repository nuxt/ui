<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button-group'
import { tv } from '../utils/tv'

const appConfigButtonGroup = _appConfig as AppConfig & { ui: { buttonGroup: Partial<typeof theme> } }

const buttonGroup = tv({ extend: tv(theme), ...(appConfigButtonGroup.ui?.buttonGroup) })

type ButtonGroupVariants = VariantProps<typeof buttonGroup>

export interface ButtonGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: ButtonGroupVariants['size']
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: ButtonGroupVariants['orientation']
  class?: any
}

export interface ButtonGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'reka-ui'
import { buttonGroupInjectionKey } from '../composables/useButtonGroup'

const props = withDefaults(defineProps<ButtonGroupProps>(), {
  orientation: 'horizontal'
})
defineSlots<ButtonGroupSlots>()

provide(buttonGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})))
</script>

<template>
  <Primitive :as="as" :class="buttonGroup({ orientation, class: props.class })">
    <slot />
  </Primitive>
</template>
