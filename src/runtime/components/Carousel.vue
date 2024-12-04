<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import type { AcceptableValue } from 'reka-ui'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import type { AutoplayOptionsType } from 'embla-carousel-autoplay'
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll'
import type { AutoHeightOptionsType } from 'embla-carousel-auto-height'
import type { ClassNamesOptionsType } from 'embla-carousel-class-names'
import type { FadeOptionsType } from 'embla-carousel-fade'
import type { WheelGesturesPluginOptions } from 'embla-carousel-wheel-gestures'
import _appConfig from '#build/app.config'
import theme from '#build/ui/carousel'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { ButtonProps } from '../types'
import type { PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { carousel: Partial<typeof theme> } }

const carousel = tv({ extend: tv(theme), ...(appConfig.ui?.carousel || {}) })

type CarouselVariants = VariantProps<typeof carousel>

export interface CarouselProps<T> extends Omit<EmblaOptionsType, 'axis' | 'container' | 'slides' | 'direction'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Configure the prev button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  prev?: ButtonProps
  /**
   * The icon displayed in the prev button.
   * @defaultValue appConfig.ui.icons.arrowLeft
   */
  prevIcon?: string
  /**
   * Configure the next button when arrows are enabled.
   * @defaultValue { size: 'md', color: 'neutral', variant: 'link' }
   */
  next?: ButtonProps
  /**
   * The icon displayed in the next button.
   * @defaultValue appConfig.ui.icons.arrowRight
   */
  nextIcon?: string
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
  orientation?: CarouselVariants['orientation']
  items?: T[]
  /**
   * Enable Autoplay plugin
   * @link https://www.embla-carousel.com/plugins/autoplay/
   */
  autoplay?: boolean | AutoplayOptionsType
  /**
   * Enable Auto Scroll plugin
   * @link https://www.embla-carousel.com/plugins/auto-scroll/
   */
  autoScroll?: boolean | AutoScrollOptionsType
  /**
   * Enable Auto Height plugin
   * @link https://www.embla-carousel.com/plugins/auto-height/
   */
  autoHeight?: boolean | AutoHeightOptionsType
  /**
   * Enable Class Names plugin
   * @link https://www.embla-carousel.com/plugins/class-names/
   */
  classNames?: boolean | ClassNamesOptionsType
  /**
   * Enable Fade plugin
   * @link https://www.embla-carousel.com/plugins/fade/
   */
  fade?: boolean | FadeOptionsType
  /**
   * Enable Wheel Gestures plugin
   * @link https://www.embla-carousel.com/plugins/wheel-gestures/
   */
  wheelGestures?: boolean | WheelGesturesPluginOptions
  class?: any
  ui?: PartialString<typeof carousel.slots>
}

export type CarouselSlots<T> = {
  default(props: { item: T, index: number }): any
}

extendDevtoolsMeta({ example: 'CarouselExample' })
</script>

<script setup lang="ts" generic="T extends AcceptableValue">
import { computed, ref, watch, onMounted } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { Primitive, useForwardProps } from 'reka-ui'
import { reactivePick, computedAsync } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import UButton from './Button.vue'

const props = withDefaults(defineProps<CarouselProps<T>>(), {
  orientation: 'horizontal',
  arrows: false,
  dots: false,
  // Embla Options
  active: true,
  align: 'center',
  breakpoints: () => ({}),
  containScroll: 'trimSnaps',
  dragFree: false,
  dragThreshold: 10,
  duration: 25,
  inViewThreshold: 0,
  loop: false,
  skipSnaps: false,
  slidesToScroll: 1,
  startIndex: 0,
  watchDrag: true,
  watchResize: true,
  watchSlides: true,
  watchFocus: true,
  // Embla Plugins
  autoplay: false,
  autoScroll: false,
  autoHeight: false,
  classNames: false,
  fade: false,
  wheelGestures: false
})
defineSlots<CarouselSlots<T>>()

const appConfig = useAppConfig()
const { dir, t } = useLocale()
const rootProps = useForwardProps(reactivePick(props, 'active', 'align', 'breakpoints', 'containScroll', 'dragFree', 'dragThreshold', 'duration', 'inViewThreshold', 'loop', 'skipSnaps', 'slidesToScroll', 'startIndex', 'watchDrag', 'watchResize', 'watchSlides', 'watchFocus'))

const prevIcon = computed(() => props.prevIcon || (dir.value === 'rtl' ? appConfig.ui.icons.arrowRight : appConfig.ui.icons.arrowLeft))
const nextIcon = computed(() => props.nextIcon || (dir.value === 'rtl' ? appConfig.ui.icons.arrowLeft : appConfig.ui.icons.arrowRight))

const ui = computed(() => carousel({
  orientation: props.orientation
}))

const options = computed<EmblaOptionsType>(() => ({
  ...(props.fade ? { align: 'center', containScroll: false } : {}),
  ...rootProps.value,
  axis: props.orientation === 'horizontal' ? 'x' : 'y',
  direction: dir.value === 'rtl' ? 'rtl' : 'ltr'
}))

const plugins = computedAsync<EmblaPluginType[]>(async () => {
  const plugins = []

  if (props.autoplay) {
    const AutoplayPlugin = await import('embla-carousel-autoplay').then(r => r.default)
    plugins.push(AutoplayPlugin(typeof props.autoplay === 'boolean' ? {} : props.autoplay))
  }

  if (props.autoScroll) {
    const AutoScrollPlugin = await import('embla-carousel-auto-scroll').then(r => r.default)
    plugins.push(AutoScrollPlugin(typeof props.autoScroll === 'boolean' ? {} : props.autoScroll))
  }

  if (props.autoHeight) {
    const AutoHeightPlugin = await import('embla-carousel-auto-height').then(r => r.default)
    plugins.push(AutoHeightPlugin(typeof props.autoHeight === 'boolean' ? {} : props.autoHeight))
  }

  if (props.classNames) {
    const ClassNamesPlugin = await import('embla-carousel-class-names').then(r => r.default)
    plugins.push(ClassNamesPlugin(typeof props.classNames === 'boolean' ? {} : props.classNames))
  }

  if (props.fade) {
    const FadePlugin = await import('embla-carousel-fade').then(r => r.default)
    plugins.push(FadePlugin(typeof props.fade === 'boolean' ? {} : props.fade))
  }

  if (props.wheelGestures) {
    const { WheelGesturesPlugin } = await import('embla-carousel-wheel-gestures')
    plugins.push(WheelGesturesPlugin(typeof props.wheelGestures === 'boolean' ? {} : props.wheelGestures))
  }

  return plugins
})

const [emblaRef, emblaApi] = useEmblaCarousel(options.value, plugins.value)

watch([options, plugins], () => {
  emblaApi.value?.reInit(options.value, plugins.value)
})

function scrollPrev() {
  emblaApi.value?.scrollPrev()
}
function scrollNext() {
  emblaApi.value?.scrollNext()
}
function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}

function onKeyDown(event: KeyboardEvent) {
  const prevKey = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

  if (event.key === prevKey) {
    event.preventDefault()
    scrollPrev()

    return
  }

  if (event.key === nextKey) {
    event.preventDefault()
    scrollNext()
  }
}

const canScrollNext = ref(false)
const canScrollPrev = ref(false)
const selectedIndex = ref<number>(0)
const scrollSnaps = ref<number[]>([])

function onInit(api: EmblaCarouselType) {
  scrollSnaps.value = api?.scrollSnapList() || []
}
function onSelect(api: EmblaCarouselType) {
  canScrollNext.value = api?.canScrollNext() || false
  canScrollPrev.value = api?.canScrollPrev() || false
  selectedIndex.value = api?.selectedScrollSnap() || 0
}

onMounted(() => {
  if (!emblaApi.value) {
    return
  }

  emblaApi.value?.on('init', onInit)
  emblaApi.value?.on('init', onSelect)
  emblaApi.value?.on('reInit', onInit)
  emblaApi.value?.on('reInit', onSelect)
  emblaApi.value?.on('select', onSelect)
})

defineExpose({
  emblaRef,
  emblaApi
})
</script>

<template>
  <Primitive
    :as="as"
    role="region"
    aria-roledescription="carousel"
    tabindex="0"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @keydown="onKeyDown"
  >
    <div ref="emblaRef" :class="ui.viewport({ class: props.ui?.viewport })">
      <div :class="ui.container({ class: props.ui?.container })">
        <div
          v-for="(item, index) in items"
          :key="index"
          role="group"
          aria-roledescription="slide"
          :class="ui.item({ class: props.ui?.item })"
        >
          <slot :item="item" :index="index" />
        </div>
      </div>
    </div>

    <div v-if="arrows || dots" :class="ui.controls({ class: props.ui?.controls })">
      <div v-if="arrows" :class="ui.arrows({ class: props.ui?.arrows })">
        <UButton
          :disabled="!canScrollPrev"
          :icon="prevIcon"
          size="md"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.prev')"
          v-bind="typeof prev === 'object' ? prev : undefined"
          :class="ui.prev({ class: props.ui?.prev })"
          @click="scrollPrev"
        />
        <UButton
          :disabled="!canScrollNext"
          :icon="nextIcon"
          size="md"
          color="neutral"
          variant="outline"
          :aria-label="t('carousel.next')"
          v-bind="typeof next === 'object' ? next : undefined"
          :class="ui.next({ class: props.ui?.next })"
          @click="scrollNext"
        />
      </div>

      <div v-if="dots" :class="ui.dots({ class: props.ui?.dots })">
        <template v-for="(_, index) in scrollSnaps" :key="index">
          <button
            :aria-label="t('carousel.goto', { slide: index + 1 })"
            :class="ui.dot({ class: props.ui?.dot, active: selectedIndex === index })"
            @click="scrollTo(index)"
          />
        </template>
      </div>
    </div>
  </Primitive>
</template>
