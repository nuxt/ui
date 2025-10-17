<script lang="ts">
import type { VirtualItem } from '@tanstack/vue-virtual'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/scroll-area'
import type { ComponentConfig } from '../types/tv'

type ScrollArea = ComponentConfig<typeof theme, AppConfig, 'scrollArea'>

export interface ScrollAreaProps<T = any> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The scroll direction.
   * @defaultValue 'vertical'
   */
  orientation?: 'vertical' | 'horizontal'
  /**
   * Array of items to render.
   */
  items?: T[]
  /**
   * Enable virtualization for large lists.
   * @defaultValue false
   */
  virtualize?: boolean | {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item
     * @defaultValue 100
     */
    estimateSize?: number
    /**
     * Gap (in px) between items
     * @defaultValue 0
     */
    gap?: number
    /**
     * Padding (in px) at the start of the list
     * @defaultValue 0
     */
    paddingStart?: number
    /**
     * Padding (in px) at the end of the list
     * @defaultValue 0
     */
    paddingEnd?: number
    /**
     * Scroll margin (in px) offset for scroll calculations
     * @defaultValue 0
     */
    scrollMargin?: number
    /**
     * Number of lanes (columns for vertical, rows for horizontal)
     * @defaultValue 1
     */
    lanes?: number
    /**
     * Custom key generation function for items
     */
    getItemKey?: (index: number) => string | number
  }
  class?: any
  ui?: ScrollArea['slots']
}

export interface ScrollAreaSlots<T = any> {
  default(props: { item: T, index: number, virtualItem?: VirtualItem } | Record<string, never>): any
}
</script>

<script setup lang="ts" generic="T = any">
import { computed, ref, toRef, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<ScrollAreaProps<T>>(), {
  as: 'div',
  orientation: 'vertical',
  virtualize: false
})
defineSlots<ScrollAreaSlots<T>>()

const appConfig = useAppConfig() as ScrollArea['AppConfig']

const rootRef = ref()

const virtualizerProps = toRef(() => defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
  estimateSize: 100,
  overscan: 12,
  gap: 0,
  paddingStart: 0,
  paddingEnd: 0,
  scrollMargin: 0,
  lanes: 1
}))

const virtualizer = useVirtualizer({
  enabled: !!props.virtualize,
  get count() {
    return props.items?.length || 0
  },
  getScrollElement: () => (rootRef.value?.$el || null),
  get horizontal() {
    return props.orientation === 'horizontal'
  },
  get overscan() {
    return virtualizerProps.value.overscan
  },
  estimateSize: () => virtualizerProps.value.estimateSize,
  get gap() {
    return virtualizerProps.value.gap
  },
  get paddingStart() {
    return virtualizerProps.value.paddingStart
  },
  get paddingEnd() {
    return virtualizerProps.value.paddingEnd
  },
  get scrollMargin() {
    return virtualizerProps.value.scrollMargin
  },
  get lanes() {
    return virtualizerProps.value.lanes
  },
  getItemKey: virtualizerProps.value.getItemKey
})

// Computed refs for virtual items and total size
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

// Computed values for lane calculations (to avoid re-computing per item)
const laneSize = computed(() => {
  const lanes = virtualizerProps.value.lanes
  return lanes > 1 ? 100 / lanes : 100
})
const hasLanes = computed(() => virtualizerProps.value.lanes > 1)
const gapPadding = computed(() => {
  const gap = virtualizerProps.value.gap
  return gap ? `${gap / 2}px` : undefined
})

// Watch for lane changes and reset measurements
watch(() => virtualizerProps.value.lanes, () => {
  virtualizer.value.measure()
}, { flush: 'sync' })

// Measure element for dynamic sizing
function measureElement(el: Element | null) {
  if (!el) return undefined
  virtualizer.value.measureElement(el)
  return undefined
}

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.scrollArea || {}) })({
  orientation: props.orientation
}))
</script>

<template>
  <Primitive
    ref="rootRef"
    :as="as"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="{
      paddingInline: orientation === 'vertical' ? gapPadding : undefined,
      paddingBlock: orientation === 'horizontal' ? gapPadding : undefined
    }"
  >
    <template v-if="!!virtualize">
      <div
        :class="ui.viewport({ class: props.ui?.viewport })"
        :style="{
          position: 'relative',
          width: orientation === 'horizontal' ? `${totalSize}px` : '100%',
          height: orientation === 'vertical' ? `${totalSize}px` : '100%'
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="virtualItem.key"
          :ref="measureElement"
          :data-index="virtualItem.index"
          :style="{
            paddingInline: orientation === 'vertical' ? gapPadding : undefined,
            paddingBlock: orientation === 'horizontal' ? gapPadding : undefined,
            position: 'absolute',
            top: orientation === 'horizontal' && hasLanes && virtualItem.lane !== undefined
              ? `${virtualItem.lane * laneSize}%`
              : 0,
            left: orientation === 'vertical' && hasLanes && virtualItem.lane !== undefined
              ? `${virtualItem.lane * laneSize}%`
              : 0,
            height: orientation === 'horizontal'
              ? hasLanes && virtualItem.lane !== undefined ? `${laneSize}%` : '100%'
              : undefined,
            width: orientation === 'vertical'
              ? hasLanes && virtualItem.lane !== undefined ? `${laneSize}%` : '100%'
              : undefined,
            transform: orientation === 'horizontal'
              ? `translateX(${virtualItem.start}px)`
              : `translateY(${virtualItem.start}px)`
          }"
        >
          <slot
            :item="(items![virtualItem.index] as T)"
            :index="virtualItem.index"
            :virtual-item="virtualItem"
          />
        </div>
      </div>
    </template>

    <template v-else-if="items?.length">
      <slot
        v-for="(item, index) in items"
        :item="item"
        :index="index"
      />
    </template>

    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
