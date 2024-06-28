<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/button-group'
import type { ButtonProps } from './Button.vue'

const appConfig = _appConfig as AppConfig & { ui: { buttonGroup: Partial<typeof theme> } }

const buttonGroup = tv({ extend: tv(theme), ...(appConfig.ui?.buttonGroup) })

type ButtonGroupVariants = VariantProps<typeof buttonGroup>

export interface ButtonGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  size?: ButtonProps['size']
  /**
   * The orientation the buttons are laid out.
   * @defaultValue 'horizontal'
   */
  orientation?: ButtonGroupVariants['orientation']
  class?: any
}

export interface ButtonGroupSlots {
  default(props?: any): any
}
</script>

<script setup lang="ts">
import { provide, computed } from 'vue'
import { Primitive } from 'radix-vue'
import { buttonGroupInjectionKey } from '#imports'

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
  <Primitive :as="as" :class="buttonGroup({ orientation })">
    <slot />
  </Primitive>
</template>
