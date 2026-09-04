<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/wheel-picker-group'
import type { WheelPickerProps } from './WheelPicker.vue'
import type { ComponentConfig } from '../types/tv'

type WheelPickerGroup = ComponentConfig<typeof theme, AppConfig, 'wheelPickerGroup'>

export interface WheelPickerGroupProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The color shared by every column and the center indicator.
   * @defaultValue 'neutral'
   */
  color?: WheelPickerGroup['variants']['color']
  /**
   * The center indicator style shared by the group.
   * @defaultValue 'pill'
   */
  variant?: WheelPickerGroup['variants']['variant']
  /** The size shared by every column. */
  size?: WheelPickerProps['size']
  /**
   * The item height shared by every column so they stay aligned, in pixels.
   * @defaultValue 32
   */
  itemHeight?: number
  /**
   * The number of visible items shared by every column.
   * @defaultValue 5
   */
  visibleItems?: number
  class?: any
  ui?: WheelPickerGroup['slots']
}

export interface WheelPickerGroupSlots {
  default?(props: { ui: WheelPickerGroup['ui'] }): VNode[]
}
</script>

<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { wheelPickerGroupInjectionKey } from '../composables/useWheelPicker'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<WheelPickerGroupProps>(), {
  itemHeight: 32,
  visibleItems: 5
})
defineSlots<WheelPickerGroupSlots>()

const props = useComponentProps('wheelPickerGroup', _props)

const appConfig = useAppConfig() as WheelPickerGroup['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const itemHeight = computed(() => props.itemHeight ?? 32)
// eslint-disable-next-line vue/no-dupe-keys
const visibleItems = computed(() => props.visibleItems ?? 5)

// Share geometry and appearance with the wrapped `<UWheelPicker>` columns so
// they align and adopt the group's frameless style (see `wheelPickerGroupInjectionKey`).
provide(wheelPickerGroupInjectionKey, {
  size: () => props.size,
  color: () => props.color,
  variant: () => props.variant,
  itemHeight: () => props.itemHeight,
  visibleItems: () => props.visibleItems
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.wheelPickerGroup || {}) })({
  color: props.color,
  variant: props.variant
}))

const contentStyle = computed(() => ({ height: `${visibleItems.value * itemHeight.value}px` }))
const indicatorStyle = computed(() => ({ height: `${itemHeight.value}px` }))
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div aria-hidden="true" data-slot="indicator" :style="indicatorStyle" :class="ui.indicator({ class: props.ui?.indicator })" />

    <div data-slot="content" :style="contentStyle" :class="ui.content({ class: props.ui?.content })">
      <slot :ui="ui" />
    </div>
  </Primitive>
</template>
