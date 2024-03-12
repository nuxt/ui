<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/badge'

const appConfig = _appConfig as AppConfig & { ui: { badge: Partial<typeof theme> } }

const badge = tv({ extend: tv(theme), ...(appConfig.ui?.badge || {}) })

type BadgeVariants = VariantProps<typeof badge>

export interface BadgeProps {
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
const props = withDefaults(defineProps<BadgeProps>(), { as: 'span' })
defineSlots<BadgeSlots>()
</script>

<template>
  <component :is="as" :class="badge({ color, variant, size, class: props.class })">
    <slot>
      {{ label }}
    </slot>
  </component>
</template>