<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/badge'

const appConfig = _appConfig as AppConfig & { ui: { badge: Partial<typeof theme> } }

const badge = tv({ extend: tv(theme), ...(appConfig.ui?.badge || {}) })

type BadgeVariants = VariantProps<typeof badge>

export interface BadgeProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'span'
   */
  as?: any
  label?: string | number
  color?: BadgeVariants['color']
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  class?: any
}

export interface BadgeSlots {
  default(props?: any): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span'
})
defineSlots<BadgeSlots>()
</script>

<template>
  <Primitive :as="as" :class="badge({ color, variant, size, class: props.class })">
    <slot>
      {{ label }}
    </slot>
  </Primitive>
</template>
