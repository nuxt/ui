<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/kbd'

const appConfig = _appConfig as AppConfig & { ui: { kbd: Partial<typeof theme> } }

const kbd = tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) })

type KbdVariants = VariantProps<typeof kbd>

export interface KbdProps extends Omit<PrimitiveProps, 'asChild'> {
  value?: string
  size?: KbdVariants['size']
  class?: any
}

export interface KbdSlots {
  default(): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'

const props = withDefaults(defineProps<KbdProps>(), { as: 'kbd' })
defineSlots<KbdSlots>()
</script>

<template>
  <Primitive :as="as" :class="kbd({ size, class: props.class })">
    <slot>
      {{ value }}
    </slot>
  </Primitive>
</template>