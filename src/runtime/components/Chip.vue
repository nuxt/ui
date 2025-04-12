<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chip'
import type { ComponentConfig } from '../types/utils'

type Chip = ComponentConfig<typeof theme, AppConfig, 'chip'>

export interface ChipProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** Display some text inside the chip. */
  text?: string | number
  /**
   * @defaultValue 'primary'
   */
  color?: Chip['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: Chip['variants']['size']
  /**
   * The position of the chip.
   * @defaultValue 'top-right'
   */
  position?: Chip['variants']['position']
  /** When `true`, keep the chip inside the component for rounded elements. */
  inset?: boolean
  /** When `true`, render the chip relatively to the parent. */
  standalone?: boolean
  class?: any
  ui?: Chip['slots']
}

export interface ChipEmits {
  (e: 'update:show', payload: boolean): void
}

export interface ChipSlots {
  default(props?: {}): any
  content(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChipProps>(), {
  inset: false,
  standalone: false
})
defineSlots<ChipSlots>()

const show = defineModel<boolean>('show', { default: true })

const { size } = useAvatarGroup(props)
const appConfig = useAppConfig() as Chip['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.chip || {}) })({
  color: props.color,
  size: size.value,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span v-if="show" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
