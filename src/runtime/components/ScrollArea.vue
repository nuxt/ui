<script lang="ts">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { VirtualItem, VirtualizerOptions } from '@tanstack/vue-virtual'
import theme from '#build/ui/scroll-area'
import type { ComponentConfig } from '../types/tv'

type ScrollArea = ComponentConfig<typeof theme, AppConfig, 'scrollArea'>

export interface ScrollAreaVirtualizeOptions extends Partial<Omit<
  VirtualizerOptions<Element, Element>,
  'count' | 'getScrollElement' | 'horizontal' | 'isRtl' | 'estimateSize' | 'lanes' | 'enabled'
>> {
  /**
   * Estimated size (in px) of each item along the scroll axis. Can be a number or a function.
   * @defaultValue 100
   */
  estimateSize?: number | ((index: number) => number)
  /**
   * Number of lanes for multi-column/row layouts.
   * For responsive lane counts, use a computed property with viewport/container size:
   * @example
   * ```ts
   * const { width } = useWindowSize()
   * const lanes = computed(() => Math.floor(width.value / 300))
   * ```
   * @defaultValue undefined
   */
  lanes?: number
}

export type ScrollAreaItem = any

export interface ScrollAreaProps<T extends ScrollAreaItem = ScrollAreaItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The scroll direction.
   * @defaultValue 'vertical'
   */
  orientation?: ScrollArea['variants']['orientation']
  /**
   * Array of items to render.
   */
  items?: T[]
  /**
   * Enable virtualization for large lists.
   * @see https://tanstack.com/virtual/latest/docs/api/virtualizer#options
   * @defaultValue false
   */
  virtualize?: boolean | ScrollAreaVirtualizeOptions
  class?: any
  ui?: ScrollArea['slots']
}

export interface ScrollAreaSlots<T extends ScrollAreaItem = ScrollAreaItem> {
  default(
    props:
      | { item: T, index: number, virtualItem?: VirtualItem }
      | Record<string, never>,
  ): any
}

export interface ScrollAreaEmits {
  /**
   * Emitted when scroll state changes
   * @param isScrolling - Whether the list is currently being scrolled
   */
  scroll: [isScrolling: boolean]
}
</script>

<script setup lang="ts" generic="T extends ScrollAreaItem">
import { computed, toRef, useTemplateRef, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { tv } from '../utils/tv'
import { useLocale } from '../composables/useLocale'

const props = withDefaults(defineProps<ScrollAreaProps<T>>(), {
  orientation: 'vertical',
  virtualize: false
})
defineSlots<ScrollAreaSlots<T>>()
const emits = defineEmits<ScrollAreaEmits>()

const { dir } = useLocale()
const appConfig = useAppConfig() as ScrollArea['AppConfig']
const uiProp = useComponentUI('scrollArea', props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.scrollArea || {}) })({
  orientation: props.orientation
}))

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')

const isRtl = computed(() => dir.value === 'rtl')
const isHorizontal = computed(() => props.orientation === 'horizontal')
const isVertical = computed(() => !isHorizontal.value)

const virtualizerProps = toRef(() => {
  const options = typeof props.virtualize === 'boolean' ? {} : props.virtualize

  return defu(options, {
    estimateSize: 100,
    overscan: 12,
    gap: 0,
    paddingStart: 0,
    paddingEnd: 0,
    scrollMargin: 0
  })
})

const lanes = computed(() => {
  const value = virtualizerProps.value.lanes
  return typeof value === 'number' ? value : undefined
})

const virtualizer = !!props.virtualize && useVirtualizer({
  ...virtualizerProps.value,
  get overscan() {
    return virtualizerProps.value.overscan
  },
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
    return lanes.value
  },
  get isRtl() {
    return isRtl.value
  },
  get count() {
    return props.items?.length || 0
  },
  getScrollElement: () => rootRef.value?.$el,
  get horizontal() {
    return isHorizontal.value
  },
  estimateSize: (index: number) => {
    const estimate = virtualizerProps.value.estimateSize
    return typeof estimate === 'function' ? estimate(index) : estimate
  }
})

const virtualItems = computed<VirtualItem[]>(() => virtualizer ? virtualizer.value.getVirtualItems() : [])
const totalSize = computed(() => virtualizer ? virtualizer.value.getTotalSize() : 0)

const virtualViewportStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  inlineSize: isHorizontal.value ? `${totalSize.value}px` : '100%',
  blockSize: isVertical.value ? `${totalSize.value}px` : '100%'
}))

function getVirtualItemStyle(virtualItem: VirtualItem): CSSProperties {
  const hasLanes = lanes.value !== undefined && lanes.value > 1
  const lane = virtualItem.lane
  const gap = virtualizerProps.value.gap ?? 0

  // For cross-axis gaps: calculate size and position accounting for gaps between lanes
  // laneSize = (100% - (lanes - 1) * gap) / lanes
  // lanePosition = lane * (laneSize + gap)
  const laneSize = hasLanes
    ? `calc((100% - ${(lanes.value! - 1) * gap}px) / ${lanes.value})`
    : '100%'
  const lanePosition = hasLanes && lane !== undefined
    ? `calc(${lane} * ((100% - ${(lanes.value! - 1) * gap}px) / ${lanes.value} + ${gap}px))`
    : 0

  return {
    position: 'absolute',
    insetBlockStart: isHorizontal.value && hasLanes ? lanePosition : 0,
    insetInlineStart: isVertical.value && hasLanes ? lanePosition : 0,
    blockSize: isHorizontal.value ? (hasLanes ? laneSize : '100%') : undefined,
    inlineSize: isVertical.value ? (hasLanes ? laneSize : '100%') : undefined,
    transform: isHorizontal.value
      ? `translateX(${isRtl.value ? -virtualItem.start : virtualItem.start}px)`
      : `translateY(${virtualItem.start}px)`
  }
}

// Remeasure when lanes change
watch(lanes, () => {
  if (virtualizer) {
    virtualizer.value.measure()
  }
}, { flush: 'sync' })

function measureElement(el: Element | ComponentPublicInstance | null) {
  if (el && virtualizer) {
    const element = el instanceof Element ? el : (el as ComponentPublicInstance).$el as Element
    virtualizer.value.measureElement(element)
  }
}

// Emit scroll state changes
watch(
  () => (virtualizer ? virtualizer.value.isScrolling : false),
  isScrolling => emits('scroll', isScrolling)
)

function getItemKey(item: T, index: number) {
  if (virtualizerProps.value.getItemKey) {
    return virtualizerProps.value.getItemKey(index)
  }
  if (item && typeof item === 'object' && 'id' in item) {
    return (item as any).id
  }
  return index
}

defineExpose({
  get $el() {
    return rootRef.value?.$el as HTMLElement
  },
  virtualizer: virtualizer || undefined
})
</script>

<template>
  <Primitive
    ref="rootRef"
    :as="as"
    data-slot="root"
    :data-orientation="orientation"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
  >
    <template v-if="virtualizer">
      <div
        data-slot="viewport"
        :class="ui.viewport({ class: uiProp?.viewport })"
        :style="virtualViewportStyle"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="String(virtualItem.key)"
          :ref="measureElement"
          :data-index="virtualItem.index"
          data-slot="item"
          :class="ui.item({ class: uiProp?.item })"
          :style="getVirtualItemStyle(virtualItem)"
        >
          <slot
            :item="(items?.[virtualItem.index] as T)"
            :index="virtualItem.index"
            :virtual-item="virtualItem"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
        <template v-if="items?.length">
          <div
            v-for="(item, index) in items"
            :key="getItemKey(item, index)"
            data-slot="item"
            :class="ui.item({ class: uiProp?.item })"
          >
            <slot :item="item" :index="index" />
          </div>
        </template>

        <template v-else>
          <slot />
        </template>
      </div>
    </template>
  </Primitive>
</template>
