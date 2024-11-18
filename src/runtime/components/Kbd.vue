<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/kbd'
import type { KbdKey } from '../composables/useKbd'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'

const appConfig = _appConfig as AppConfig & { ui: { kbd: Partial<typeof theme> } }

const kbd = tv({ extend: tv(theme), ...(appConfig.ui?.kbd || {}) })

type KbdVariants = VariantProps<typeof kbd>

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: any
  value?: KbdKey | string
  variant?: KbdVariants['variant']
  size?: KbdVariants['size']
  class?: any
}

export interface KbdSlots {
  default(props?: {}): any
}
extendDevtoolsMeta({ defaultProps: { value: 'K' } })
</script>

<script setup lang="ts">
import { Primitive } from 'reka-ui'
import { useKbd } from '../composables/useKbd'

const props = withDefaults(defineProps<KbdProps>(), {
  as: 'kbd'
})
defineSlots<KbdSlots>()

const { getKbdKey } = useKbd()
</script>

<template>
  <Primitive :as="as" :class="kbd({ variant, size, class: props.class })">
    <slot>
      {{ getKbdKey(value) }}
    </slot>
  </Primitive>
</template>
