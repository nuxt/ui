<script lang="ts">
import type { VNode, InjectionKey, ComputedRef } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/chip'
import type { ComponentConfig } from '../types/tv'

type Chip = ComponentConfig<typeof theme, AppConfig, 'chip'>

/**
 * Lets `UAvatar` bind fallthrough attributes onto the chip's own root when it renders itself
 * as a chip, bypassing the default behaviour of forwarding them to the slotted content
 * (see nuxt/ui#2484, where a `UChip` wrapping a `UButton` trigger needs those attributes on
 * the button instead).
 */
export const chipRootAttrsInjectionKey: InjectionKey<ComputedRef<Record<string, any>>> = Symbol('nuxt-ui.chip-root-attrs')

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
  'update:show': [value: boolean]
}

export interface ChipSlots {
  default?(props?: {}): VNode[]
  content?(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { Primitive, Slot } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useAvatarGroup } from '../composables/useAvatarGroup'
import { tv } from '../utils/tv'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ChipProps>(), {
  inset: false,
  standalone: false
})
defineSlots<ChipSlots>()

const props = useComponentProps('chip', _props)

const show = defineModel<boolean>('show', { default: true })

const { size } = useAvatarGroup(_props)
const appConfig = useAppConfig() as Chip['AppConfig']

const injectedRootAttrs = inject(chipRootAttrsInjectionKey, undefined)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.chip || {}) })({
  color: props.color,
  size: size.value ?? props.size,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone
}))
</script>

<template>
  <Primitive :as="props.as" :data-slot="($attrs['data-slot'] as string | undefined) ?? 'root'" v-bind="injectedRootAttrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-bind="{ ...$attrs, 'data-slot': undefined }">
      <slot />
    </Slot>

    <span v-if="show" data-slot="base" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ props.text }}
      </slot>
    </span>
  </Primitive>
</template>
