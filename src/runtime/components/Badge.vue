<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import appConfig from '#build/app.config'
import theme from '#build/ui/badge'
import type { LinkProps } from '#ui/components/Link.vue'

const badge = tv({ extend: tv(theme), ...(appConfig.ui?.badge || {}) })

type BadgeVariants = VariantProps<typeof badge>

export interface BadgeProps extends LinkProps {
  as?: string
  label?: string
  color?: BadgeVariants['color']
  variant?: BadgeVariants['variant']
  size?: BadgeVariants['size']
  class?: any
}

export interface BadgeSlots {
  default(): any
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BadgeProps>(), {
  as: 'span'
})
defineSlots<BadgeSlots>()
</script>

<template>
  <component :is="as" v-bind="$attrs" :class="badge({ color, variant, size, class: props.class })">
    <slot>
      {{ label }}
    </slot>
  </component>
</template>