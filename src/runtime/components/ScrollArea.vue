<script lang="ts">
import type { ComponentPublicInstance, CSSProperties } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { VirtualItem, VirtualizerOptions } from '@tanstack/vue-virtual'
import theme from '#build/ui/scroll-area'
import type { ComponentConfig } from '../types/tv'

type ScrollArea = ComponentConfig<typeof theme, AppConfig, 'scrollArea'>

export interface ScrollAreaVirtualizeOptions extends Partial<Omit<
  VirtualizerOptions<Element, Element>,
  'count' | 'getScrollElement' | 'horizontal' | 'enabled' | 'isRtl' | 'estimateSize' | 'lanes'
>> {
  /**
   * Enable or disable virtualization while still applying layout options.
   * @defaultValue true
   */
  enabled?: boolean
  /**
   * Estimated size (in px) of each item along the scroll axis. Can be a number or a function.
   * @defaultValue 100
   */
  estimateSize?: number | ((index: number) => number)
  /**
   * Number of lanes or target lane size for multi-column layouts.
   * - Number (e.g., 3): fixed number of columns/rows
   * - String (e.g., '300px'): responsive columns based on item width
   * @defaultValue undefined
   */
  lanes?: number | string
  /**
   * Number of items from the end to trigger loadMore event (for infinite scroll)
   * @defaultValue 5
   */
  loadMoreThreshold?: number
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
  orientation?: 'vertical' | 'horizontal'
  /**
   * Array of items to render.
   */
  items?: T[]
  /**
   * Enable virtualization for large lists.
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
  /**
   * Emitted when user scrolls near the end of the list (for infinite scroll)
   * @param lastIndex - The index of the last visible item
   */
  loadMore: [lastIndex: number]
}
</script>

<script setup lang="ts" generic="T extends ScrollAreaItem">
import { computed, toRef, useTemplateRef, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useAppConfig } from '#imports'
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

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.scrollArea || {}) })({
  orientation: props.orientation
}))

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')

const isRtl = computed(() => dir.value === 'rtl')
const isHorizontal = computed(() => props.orientation === 'horizontal')
const isVertical = computed(() => !isHorizontal.value)
const isVirtualizerEnabled = computed(() => {
  if (!props.virtualize) {
    return false
  }
  if (typeof props.virtualize === 'boolean') {
    return props.virtualize
  }
  return props.virtualize.enabled !== false
})

const virtualizerProps = toRef(() => {
  const options = typeof props.virtualize === 'boolean' ? {} : props.virtualize

  return defu(options, {
    estimateSize: 100,
    overscan: 12,
    gap: 0,
    paddingStart: 0,
    paddingEnd: 0,
    scrollMargin: 0,
    loadMoreThreshold: 5
  })
})

const lanes = computed(() => {
  const value = virtualizerProps.value.lanes
  return typeof value === 'number' ? value : undefined
})

const virtualizer = useVirtualizer({
  get enabled() {
    return isVirtualizerEnabled.value
  },
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
  getItemKey: virtualizerProps.value.getItemKey,
  get isRtl() {
    return isRtl.value
  },
  get count() {
    return props.items?.length || 0
  },
  getScrollElement: (): Element | null => rootRef.value?.$el || null,
  get horizontal() {
    return isHorizontal.value
  },
  estimateSize: typeof virtualizerProps.value.estimateSize === 'function'
    ? virtualizerProps.value.estimateSize
    : () => virtualizerProps.value.estimateSize as number
})

const virtualItems = computed<VirtualItem[]>(() => isVirtualizerEnabled.value ? virtualizer.value.getVirtualItems() : [])
const totalSize = computed(() => isVirtualizerEnabled.value ? virtualizer.value.getTotalSize() : 0)

const virtualRootStyle = computed<CSSProperties>(() => {
  const gap = virtualizerProps.value.gap ?? 0
  const halfGap = gap ? `${gap / 2}px` : undefined

  return isHorizontal.value
    ? { paddingBlock: halfGap }
    : { paddingInline: halfGap }
})

const virtualViewportStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  inlineSize: isHorizontal.value ? `${totalSize.value}px` : '100%',
  blockSize: isVertical.value ? `${totalSize.value}px` : '100%'
}))

function getVirtualItemStyle(virtualItem: VirtualItem): CSSProperties {
  const hasLanes = lanes.value !== undefined && lanes.value > 1
  const laneSize = lanes.value ? 100 / lanes.value : 100
  const lane = virtualItem.lane
  const gap = virtualizerProps.value.gap ?? 0
  const halfGap = gap ? `${gap / 2}px` : undefined

  return {
    position: 'absolute',
    insetBlockStart: isHorizontal.value && hasLanes && lane !== undefined
      ? `${(lane * 100) / lanes.value!}%`
      : 0,
    insetInlineStart: isVertical.value && hasLanes && lane !== undefined
      ? `${(lane * 100) / lanes.value!}%`
      : 0,
    blockSize: isHorizontal.value && hasLanes && lane !== undefined
      ? `${laneSize}%`
      : isHorizontal.value ? '100%' : undefined,
    inlineSize: isVertical.value && hasLanes && lane !== undefined
      ? `${laneSize}%`
      : isVertical.value ? '100%' : undefined,
    paddingBlock: isHorizontal.value ? halfGap : undefined,
    paddingInline: isVertical.value ? halfGap : undefined,
    transform: isHorizontal.value
      ? `translateX(${isRtl.value ? -virtualItem.start : virtualItem.start}px)`
      : `translateY(${virtualItem.start}px)`
  }
}

// Remeasure when lanes change
watch(lanes, () => {
  if (isVirtualizerEnabled.value) {
    virtualizer.value.measure()
  }
}, { flush: 'sync' })

function measureElement(el: Element | ComponentPublicInstance | null) {
  if (el && isVirtualizerEnabled.value) {
    const element = el instanceof Element ? el : (el as ComponentPublicInstance).$el as Element
    virtualizer.value.measureElement(element)
  }
}

// Emit scroll state changes
watch(
  () => (isVirtualizerEnabled.value ? virtualizer.value.isScrolling : false),
  isScrolling => emits('scroll', isScrolling)
)

// Emit loadMore when scrolling near the end (infinite scroll support)
watch(
  () => {
    if (!isVirtualizerEnabled.value) return -1
    const items = virtualizer.value.getVirtualItems()
    return items.length > 0 ? items[items.length - 1]?.index ?? -1 : -1
  },
  (lastVisibleIndex) => {
    if (lastVisibleIndex === -1 || !props.items?.length) return

    const threshold = virtualizerProps.value.loadMoreThreshold ?? 5
    if (lastVisibleIndex >= props.items.length - threshold) {
      emits('loadMore', lastVisibleIndex)
    }
  }
)

type ScrollToOptions = { align?: 'start' | 'center' | 'end' | 'auto', behavior?: 'auto' | 'smooth' | 'instant' }

function requireVirtualization(method: string) {
  if (!isVirtualizerEnabled.value) {
    console.warn(`${method} requires virtualization to be enabled`)
    return false
  }
  return true
}

defineExpose({
  rootRef,
  virtualizer: computed(() => isVirtualizerEnabled.value ? virtualizer.value : null),
  scrollToOffset(offset: number, options?: ScrollToOptions) {
    if (requireVirtualization('scrollToOffset')) {
      virtualizer.value.scrollToOffset(offset, options as any)
    }
  },
  scrollToIndex(index: number, options?: ScrollToOptions) {
    if (requireVirtualization('scrollToIndex')) {
      virtualizer.value.scrollToIndex(index, options as any)
    }
  },
  getTotalSize() {
    return requireVirtualization('getTotalSize') ? virtualizer.value.getTotalSize() : 0
  },
  measure() {
    if (requireVirtualization('measure')) {
      virtualizer.value.measure()
    }
  },
  getScrollOffset() {
    return isVirtualizerEnabled.value ? virtualizer.value.scrollOffset ?? 0 : 0
  },
  isScrolling() {
    return isVirtualizerEnabled.value ? virtualizer.value.isScrolling : false
  },
  getScrollDirection() {
    return isVirtualizerEnabled.value ? virtualizer.value.scrollDirection ?? null : null
  }
})
</script>

<template>
  <Primitive
    ref="rootRef"
    :as="as"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="isVirtualizerEnabled ? virtualRootStyle : undefined"
  >
    <template v-if="isVirtualizerEnabled">
      <div
        data-slot="viewport"
        :class="ui.viewport({ class: props.ui?.viewport })"
        :style="virtualViewportStyle"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="String(virtualItem.key)"
          :ref="measureElement"
          :data-index="virtualItem.index"
          data-slot="item"
          :class="ui.item({ class: props.ui?.item })"
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
      <div data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
        <template v-if="items?.length">
          <div
            v-for="(item, index) in items"
            :key="index"
            data-slot="item"
            :class="ui.item({ class: props.ui?.item })"
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
