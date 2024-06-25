<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { PrimitiveProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/kbd'
import type { KbdKey } from '../composables/useKbd'

const appConfig = _appConfig as AppConfig & { ui: { kbd: Partial<typeof theme> } }

const kbd = tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) })

type KbdVariants = VariantProps<typeof kbd>

export interface KbdProps extends Omit<PrimitiveProps, 'asChild'> {
  value: KbdKey | string
  color?: KbdVariants['color']
  size?: KbdVariants['size']
  class?: any
}

export interface KbdSlots {
  default(): any
}
</script>

<script setup lang="ts">
import { Primitive } from 'radix-vue'
import { useKbd } from '#imports'

const props = withDefaults(defineProps<KbdProps>(), { as: 'kbd' })
defineSlots<KbdSlots>()

const { getKbdKey } = useKbd()
</script>

<template>
  <Primitive :as="as" :class="kbd({ color, size, class: props.class })">
    <slot>
      {{ getKbdKey(value) }}
    </slot>
  </Primitive>
</template>
