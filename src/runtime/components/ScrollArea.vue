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
  virtualize?:
    | boolean
    | {
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
       * Lane width in pixels for responsive layouts (column width for vertical, row height for horizontal)
       * When set, lanes will be calculated automatically based on container size
       * @defaultValue undefined
       */
      laneWidth?: number
      /**
       * Minimum number of lanes for responsive layouts
       * @defaultValue 1
       */
      minLanes?: number
      /**
       * Maximum number of lanes for responsive layouts
       * @defaultValue undefined
       */
      maxLanes?: number
      /**
       * Custom key generation function for items
       */
      getItemKey?: (index: number) => string | number
    }

  class?: any
  ui?: ScrollArea['slots']
}

export interface ScrollAreaSlots<T = any> {
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

<script setup lang="ts" generic="T = any">
import { computed, ref, toRef, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Primitive } from 'reka-ui'
import { defu } from 'defu'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import { useLocale } from '../composables/useLocale'

const props = withDefaults(defineProps<ScrollAreaProps<T>>(), {
  as: 'div',
  orientation: 'vertical',
  virtualize: false
})
defineSlots<ScrollAreaSlots<T>>()
const emit = defineEmits<ScrollAreaEmits>()

const appConfig = useAppConfig() as ScrollArea['AppConfig']
const { dir } = useLocale()
const isRtl = computed(() => dir.value === 'rtl')
const rootRef = ref()
const containerSize = ref(0)

// Calculate number of lanes based on container size and lane width constraints
function calculateResponsiveLanes(): number {
  const vProps = typeof props.virtualize === 'boolean' ? {} : props.virtualize

  // If laneWidth is not set, use fixed lanes
  if (!vProps?.laneWidth) {
    return vProps?.lanes ?? 1
  }

  const size = containerSize.value
  const gap = vProps.gap ?? 0
  const laneWidth = vProps.laneWidth
  const minLanesValue = vProps.minLanes ?? 1
  const maxLanesValue = vProps.maxLanes

  if (size === 0) return minLanesValue

  // Calculate how many lanes fit iteratively
  function countLanes(count: number, consumed: number): number {
    const nextConsumed = consumed + (count > 0 ? gap : 0) + laneWidth
    if (nextConsumed <= size) {
      return countLanes(count + 1, nextConsumed)
    }
    return count
  }

  let lanes = Math.max(minLanesValue, countLanes(0, 0))

  // Apply max constraint
  if (maxLanesValue !== undefined) {
    lanes = Math.min(lanes, maxLanesValue)
  }

  return Math.max(1, lanes)
}

const virtualizerProps = toRef(() => {
  const baseProps = defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: 100,
    overscan: 12,
    gap: 0,
    paddingStart: 0,
    paddingEnd: 0,
    scrollMargin: 0,
    lanes: 1,
    minLanes: 1
  })

  // Use responsive lanes if laneWidth is set
  if (baseProps.laneWidth !== undefined) {
    baseProps.lanes = calculateResponsiveLanes()
  }

  return baseProps
})

const virtualizer = useVirtualizer({
  enabled: !!props.virtualize,
  get isRtl() {
    return isRtl.value
  },
  get count() {
    return props.items?.length || 0
  },
  getScrollElement: () => rootRef.value?.$el || null,
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

// Calculate lane position as percentage
function getLanePosition(lane: number): string {
  return `${lane * laneSize.value}%`
}

// Watch for lane changes and reset measurements
watch(
  () => virtualizerProps.value.lanes,
  () => {
    virtualizer.value.measure()
  },
  { flush: 'sync' }
)

// ResizeObserver for responsive lanes
let resizeObserver: ResizeObserver | null = null

function setupResizeObserver() {
  const vProps = typeof props.virtualize === 'boolean' ? {} : props.virtualize

  // Clean up existing observer
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  // Only setup ResizeObserver if laneWidth is defined (responsive mode)
  if (vProps?.laneWidth !== undefined && rootRef.value) {
    const element = rootRef.value.$el || rootRef.value
    const isHorizontal = props.orientation === 'horizontal'

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Measure width for vertical (columns), height for horizontal (rows)
        const newSize = isHorizontal ? entry.contentRect.height : entry.contentRect.width
        if (newSize !== containerSize.value) {
          containerSize.value = newSize
        }
      }
    })

    resizeObserver.observe(element)

    // Set initial size immediately
    const initialSize = isHorizontal
      ? (element.offsetHeight || element.clientHeight)
      : (element.offsetWidth || element.clientWidth)

    // Always set the size, even if 0 - the ResizeObserver will update it
    // But if it's 0, the calculateResponsiveLanes will use minLanes as fallback
    containerSize.value = initialSize
  } else {
    // Reset to 0 when not in responsive mode
    containerSize.value = 0
  }
}

onMounted(async () => {
  await nextTick()
  // Small delay to allow CSS to fully apply
  setTimeout(() => {
    setupResizeObserver()
  }, 0)
})

// Watch for laneWidth or orientation changes to setup/teardown observer
watch(
  () => {
    const vProps = typeof props.virtualize === 'boolean' ? {} : props.virtualize
    return [vProps?.laneWidth, props.orientation] as const
  },
  () => {
    if (rootRef.value) {
      setupResizeObserver()
    }
  }
)

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// Measure element for dynamic sizing
function measureElement(el: Element | null) {
  if (!el) return undefined
  virtualizer.value.measureElement(el)
  return undefined
}

const ui = computed(() =>
  tv({ extend: tv(theme), ...(appConfig.ui?.scrollArea || {}) })({
    orientation: props.orientation
  })
)

// Watch for scroll state changes and emit event
watch(
  () => virtualizer.value.isScrolling,
  (isScrolling) => {
    emit('scroll', isScrolling)
  }
)

// Expose virtualizer methods and properties
defineExpose({
  /**
   * The root element ref
   */
  rootRef,
  /**
   * The virtualizer instance (null if virtualization is disabled)
   */
  virtualizer: computed(() => props.virtualize ? virtualizer.value : null),
  /**
   * Scroll to a specific pixel offset
   * @param offset - The pixel offset to scroll to
   * @param options - Scroll options
   */
  scrollToOffset: (offset: number, options?: { align?: 'start' | 'center' | 'end' | 'auto', behavior?: 'auto' | 'smooth' | 'instant' }) => {
    if (!props.virtualize) {
      console.warn('scrollToOffset requires virtualization to be enabled')
      return
    }
    virtualizer.value.scrollToOffset(offset, options as any)
  },
  /**
   * Scroll to a specific item index
   * @param index - The item index to scroll to
   * @param options - Scroll options
   */
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto', behavior?: 'auto' | 'smooth' | 'instant' }) => {
    if (!props.virtualize) {
      console.warn('scrollToIndex requires virtualization to be enabled')
      return
    }
    virtualizer.value.scrollToIndex(index, options as any)
  },
  /**
   * Get the total size of all virtualized items
   * @returns The total size in pixels
   */
  getTotalSize: () => {
    if (!props.virtualize) {
      console.warn('getTotalSize requires virtualization to be enabled')
      return 0
    }
    return virtualizer.value.getTotalSize()
  },
  /**
   * Reset all previously measured item sizes
   */
  measure: () => {
    if (!props.virtualize) {
      console.warn('measure requires virtualization to be enabled')
      return
    }
    virtualizer.value.measure()
  },
  /**
   * Get current scroll offset in pixels
   * @returns The current scroll offset
   */
  getScrollOffset: () => {
    if (!props.virtualize) {
      return 0
    }
    return virtualizer.value.scrollOffset ?? 0
  },
  /**
   * Check if the list is currently being scrolled
   * @returns Whether scrolling is in progress
   */
  isScrolling: () => {
    if (!props.virtualize) {
      return false
    }
    return virtualizer.value.isScrolling
  },
  /**
   * Get the current scroll direction
   * @returns 'forward', 'backward', or null
   */
  getScrollDirection: () => {
    if (!props.virtualize) {
      return null
    }
    return virtualizer.value.scrollDirection ?? null
  }
})
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
          inlineSize: orientation === 'horizontal' ? `${totalSize}px` : '100%',
          blockSize: orientation === 'vertical' ? `${totalSize}px` : '100%'
        }"
      >
        <div
          v-for="virtualItem in virtualItems"
          :key="virtualItem.key as any"
          :ref="measureElement as any"
          :data-index="virtualItem.index"
          :class="ui.item({ class: props.ui?.item })"
          :style="{
            paddingInline: orientation === 'vertical' ? gapPadding : undefined,
            paddingBlock: orientation === 'horizontal' ? gapPadding : undefined,
            position: 'absolute',
            insetBlockStart:
              orientation === 'horizontal'
              && hasLanes
              && virtualItem.lane !== undefined
                ? getLanePosition(virtualItem.lane)
                : 0,
            insetInlineStart:
              orientation === 'vertical'
              && hasLanes
              && virtualItem.lane !== undefined
                ? getLanePosition(virtualItem.lane)
                : 0,
            blockSize:
              orientation === 'horizontal'
                ? hasLanes && virtualItem.lane !== undefined
                  ? `${laneSize}%`
                  : '100%'
                : undefined,
            inlineSize:
              orientation === 'vertical'
                ? hasLanes && virtualItem.lane !== undefined
                  ? `${laneSize}%`
                  : '100%'
                : undefined,
            transform:
              orientation === 'horizontal'
                ? `translateX(${isRtl ? -virtualItem.start : virtualItem.start}px)`
                : `translateY(${virtualItem.start}px)`
          }"
        >
          <slot
            :item="items![virtualItem.index] as T"
            :index="virtualItem.index"
            :virtual-item="virtualItem"
          />
        </div>
      </div>
    </template>

    <template v-else-if="items?.length">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="ui.item({ class: props.ui?.item })"
      >
        <slot :item="item" :index="index" />
      </div>
    </template>

    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
