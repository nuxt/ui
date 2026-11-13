<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/carousel'
import type { ButtonProps } from './Button.vue'
import type { IconProps } from './Icon.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { AcceptableValue } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Carousel = ComponentConfig<typeof theme, AppConfig, 'carousel'>

export type CarouselValue = AcceptableValue
export type CarouselItem = CarouselValue | {
  class?: any
  ui?: Partial<Pick<Carousel['slots'], 'item'>>
  [key: string]: any
}

export interface CarouselAutoplayOptions {
  /**
   * Time between two slides, in milliseconds.
   * @defaultValue 4000
   */
  delay?: number
  /**
   * Stop for good on the first press, drag, key or wheel gesture.
   * @defaultValue true
   */
  stopOnInteraction?: boolean
  /**
   * Stop on the last slide instead of going back to the first one. Ignored with `loop`.
   * @defaultValue false
   */
  stopOnLastSnap?: boolean
}

export interface CarouselAutoScrollOptions {
  /**
   * Scroll speed, in pixels per second.
   * @defaultValue 60
   */
  speed?: number
  /**
   * @defaultValue 'forward'
   */
  direction?: 'forward' | 'backward'
  /**
   * Stop for good on the first press, drag, key or wheel gesture.
   * @defaultValue true
   */
  stopOnInteraction?: boolean
}

export interface CarouselProps<T extends CarouselItem = CarouselItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Configure the prev button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  prev?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the prev button.
   * @defaultValue appConfig.ui.icons.arrowLeft
   * @IconifyIcon
   */
  prevIcon?: IconProps['name']
  /**
   * Configure the next button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  next?: Omit<ButtonProps, LinkPropsKeys>
  /**
   * The icon displayed in the next button.
   * @defaultValue appConfig.ui.icons.arrowRight
   * @IconifyIcon
   */
  nextIcon?: IconProps['name']
  /**
   * Display prev and next buttons to scroll the carousel.
   * @defaultValue false
   */
  arrows?: boolean
  /**
   * Display dots to scroll to a specific slide.
   * @defaultValue false
   */
  dots?: boolean
  /**
   * The orientation of the carousel.
   * @defaultValue 'horizontal'
   */
  orientation?: Carousel['variants']['orientation']
  items?: T[]
  /** The controlled index of the current slide. Can be bound as `v-model`. */
  modelValue?: number
  /**
   * The index of the slide to show when initially rendered. Use when you do not need to control the current slide.
   * @defaultValue 0
   */
  defaultValue?: number
  /** When `true`, the last slide is followed by the first one, and the other way around. */
  loop?: boolean
  /**
   * Where a snap places its slides in the viewport.
   * @defaultValue 'center'
   */
  align?: 'start' | 'center' | 'end'
  /**
   * How many slides one step moves. `'auto'` moves as many as fit in the viewport.
   * @defaultValue 1
   */
  slidesToScroll?: number | 'auto'
  /**
   * How the snaps at the ends are handled. `'trimSnaps'` merges the snaps that would leave empty space, `'keepSnaps'` keeps one snap per group, `false` adds empty space so every snap can be aligned. Ignored with `loop`.
   * @defaultValue 'trimSnaps'
   */
  containScroll?: 'trimSnaps' | 'keepSnaps' | false
  /** When `true`, the carousel scrolls freely with momentum instead of resting on a slide. */
  dragFree?: boolean
  /** When `true`, a fast gesture can move past several slides. */
  skipSnaps?: boolean
  /**
   * When `false`, the carousel can't be dragged, swiped or scrolled. The arrows and dots still navigate.
   * @defaultValue true
   */
  draggable?: boolean
  /** When `true`, the slides are stacked and cross-fade instead of sliding. */
  fade?: boolean
  /** When `true`, the viewport takes the height of the slides in view. Horizontal only. */
  autoHeight?: boolean
  /** When `true`, the mouse wheel pages through the slides. */
  wheelGestures?: boolean
  /**
   * The fraction (0 to 1) of a slide that has to be visible for it to count as in view.
   * @defaultValue 0
   */
  inViewThreshold?: number
  /** Move to the next slide on an interval. Pauses on hover, stops when keyboard focus enters the carousel. */
  autoplay?: boolean | CarouselAutoplayOptions
  /** Scroll the carousel continuously. Pauses on hover, stops when keyboard focus enters the carousel. */
  autoScroll?: boolean | CarouselAutoScrollOptions
  /** The controlled rotation state of `autoplay` or `autoScroll`. Can be bound as `v-model:playing`. */
  playing?: boolean
  /**
   * The rotation state when initially rendered. Rotation stops on mount when the user prefers reduced motion.
   * @defaultValue true
   */
  defaultPlaying?: boolean
  class?: any
  ui?: Carousel['slots']
}

export type CarouselSlots<T extends CarouselItem = CarouselItem> = {
  default?(props: { item: T, index: number, active: boolean, inView: boolean }): VNode[]
}

export interface CarouselEmits {
  'update:modelValue': [value: number]
  'update:playing': [value: boolean]
}
</script>

<script setup lang="ts" generic="T extends CarouselItem">
import { computed } from 'vue'
import { CarouselRoot, CarouselViewport, CarouselContent, CarouselItem as RCarouselItem, CarouselPrevious, CarouselNext, CarouselIndicator } from 'reka-ui'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

const _props = withDefaults(defineProps<CarouselProps<T>>(), {
  modelValue: undefined,
  defaultValue: 0,
  orientation: 'horizontal',
  arrows: false,
  dots: false,
  align: 'center',
  slidesToScroll: 1,
  containScroll: 'trimSnaps',
  draggable: true,
  inViewThreshold: 0,
  autoplay: false,
  autoScroll: false,
  playing: undefined,
  defaultPlaying: true
})
defineSlots<CarouselSlots<T>>()
const emits = defineEmits<CarouselEmits>()

const props = useComponentProps<CarouselProps<T>>('carousel', _props, theme)

const { dir, t } = useLocale()
const appConfig = useThemeConfig() as Carousel['AppConfig']
const overrides = useComponentOverrides((ui: Carousel['AppConfig']['ui']) => ui.carousel)

const rootProps = useForwardProps(props, ['as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'align', 'slidesToScroll', 'containScroll', 'dragFree', 'skipSnaps', 'draggable', 'fade', 'autoHeight', 'inViewThreshold', 'autoplay', 'autoScroll', 'playing', 'defaultPlaying'], emits)

// eslint-disable-next-line vue/no-dupe-keys
const prevIcon = computed(() => props.prevIcon || (dir.value === 'rtl' ? appConfig.ui.icons.arrowRight : appConfig.ui.icons.arrowLeft))
// eslint-disable-next-line vue/no-dupe-keys
const nextIcon = computed(() => props.nextIcon || (dir.value === 'rtl' ? appConfig.ui.icons.arrowLeft : appConfig.ui.icons.arrowRight))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  orientation: props.orientation,
  fade: props.fade
}))

function isCarouselItem(item: CarouselItem): item is Exclude<CarouselItem, CarouselValue> {
  return typeof item === 'object' && item !== null
}
</script>

<template>
  <CarouselRoot
    v-slot="{ modelValue, snapCount }"
    v-bind="rootProps"
    :dir="dir"
    :wheel="props.wheelGestures"
    :item-count="props.items?.length"
    :aria-roledescription="t('carousel.roledescription')"
    data-slot="carousel"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <CarouselViewport data-slot="carousel-viewport" :class="ui.viewport({ class: props.ui?.viewport })">
      <CarouselContent data-slot="carousel-container" :class="ui.container({ class: props.ui?.container })">
        <RCarouselItem
          v-for="(item, index) in props.items"
          :key="index"
          v-slot="{ active, inView }"
          :aria-roledescription="t('carousel.slide')"
          :aria-label="t('carousel.slideLabel', { slide: index + 1, total: props.items!.length })"
          data-slot="carousel-item"
          :class="ui.item({ class: [props.ui?.item, isCarouselItem(item) && item.ui?.item, isCarouselItem(item) && item.class] })"
        >
          <slot :item="item" :index="index" :active="active" :in-view="inView" />
        </RCarouselItem>
      </CarouselContent>
    </CarouselViewport>

    <div v-if="props.arrows || props.dots" data-slot="carousel-controls" :class="ui.controls({ class: props.ui?.controls })">
      <div v-if="props.arrows" data-slot="carousel-arrows" :class="ui.arrows({ class: props.ui?.arrows })">
        <CarouselPrevious as-child>
          <UButton
            :icon="prevIcon"
            color="neutral"
            variant="outline"
            :aria-label="t('carousel.prev')"
            v-bind="typeof props.prev === 'object' ? props.prev : undefined"
            data-slot="carousel-prev"
            :class="ui.prev({ class: props.ui?.prev })"
          />
        </CarouselPrevious>
        <CarouselNext as-child>
          <UButton
            :icon="nextIcon"
            color="neutral"
            variant="outline"
            :aria-label="t('carousel.next')"
            v-bind="typeof props.next === 'object' ? props.next : undefined"
            data-slot="carousel-next"
            :class="ui.next({ class: props.ui?.next })"
          />
        </CarouselNext>
      </div>

      <div v-if="props.dots" role="group" :aria-label="t('carousel.dots')" data-slot="carousel-dots" :class="ui.dots({ class: props.ui?.dots })">
        <CarouselIndicator
          v-for="index in snapCount"
          :key="index"
          :index="index - 1"
          :aria-label="t('carousel.goto', { slide: index })"
          :data-state="modelValue === index - 1 ? 'active' : undefined"
          data-slot="carousel-dot"
          :class="ui.dot({ class: props.ui?.dot, active: modelValue === index - 1 })"
        />
      </div>
    </div>
  </CarouselRoot>
</template>
