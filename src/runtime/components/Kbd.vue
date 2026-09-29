<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/kbd'
import type { KbdKey } from '../composables/useKbd'
import type { ComponentConfig } from '../types/tv'

type Kbd = ComponentConfig<typeof theme, AppConfig, 'kbd'>

export interface KbdProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'kbd'
   */
  as?: any
  value?: KbdKey | string
  /**
   * @defaultValue 'neutral'
   */
  color?: Kbd['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Kbd['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Kbd['variants']['size']
  class?: any
  ui?: Kbd['slots']
}

export interface KbdSlots {
  default?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useKbd } from '../composables/useKbd'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<KbdProps>(), {
  as: 'kbd'
})
defineSlots<KbdSlots>()

const props = useComponentProps('kbd', _props, theme)

const { getKbdKey } = useKbd()
const appConfig = useThemeConfig() as Kbd['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.kbd)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  color: props.color,
  variant: props.variant,
  size: props.size
}))
</script>

<template>
  <Primitive :as="props.as" data-slot="kbd" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <slot>
      {{ getKbdKey(props.value) }}
    </slot>
  </Primitive>
</template>
