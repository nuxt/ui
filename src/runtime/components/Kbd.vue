<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/kbd'

const appConfig = _appConfig as AppConfig & { ui: { kbd: Partial<typeof theme> } }

const kbd = tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) })

type KbdVariants = VariantProps<typeof kbd>

export interface KbdProps {
  as?: string
  value?: string
  size?: KbdVariants['size']
  class?: any
}

export interface KbdSlots {
  default(): any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<KbdProps>(), { as: 'kbd' })
defineSlots<KbdSlots>()
</script>

<template>
  <component :is="as" :class="kbd({ size, class: props.class })">
    <slot>
      {{ value }}
    </slot>
  </component>
</template>