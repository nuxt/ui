<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/color-picker'
import type { HSBColor, RGBColor, HEXColor } from '../types/color'

const appConfig = _appConfig as AppConfig & { ui: { colorPicker: Partial<typeof theme> } }

const colorPicker = tv({ extend: tv(theme), ...(appConfig.ui?.colorPicker || {}) })

type ColorPickerVariants = VariantProps<typeof colorPicker>

export type ColorPickerFormat = 'hex' | 'rgb' | 'hsb'

export type ColorPickerModelValues = {
  hex: HEXColor
  rgb: RGBColor
  hsb: HSBColor
}

export type ColorPickerProps<Format extends ColorPickerFormat> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Throttle time in ms for the color picker
   */
  throttle?: number
  disabled?: boolean
  defaultValue?: ColorPickerModelValues[Format]
  /**
   * Format of the color
   * @defaultValue 'hex'
   */
  format?: Format
  size?: ColorPickerVariants['size']
  class?: any
  ui?: Partial<typeof colorPicker.slots>
}
</script>

<script setup lang="ts" generic="Format extends ColorPickerFormat = 'hex'">
import { ref } from 'vue'
import { Primitive } from 'radix-vue'
import { useEventListener, useElementBounding, watchThrottled } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import { normalizeHSB, normalizeBrightness, normalizeHue, transformHEXtoHSB, transformHSBtoHEX, transformHSBtoRGB, transformRGBtoHSB } from '../utils/color'

const props = withDefaults(defineProps<ColorPickerProps<Format>>(), {
  throttle: 50
})
const modelValue = defineModel<ColorPickerModelValues[Format], string, HSBColor, HSBColor>({
  get: (value) => {
    switch (props.format) {
      case 'hsb':
        return value
      case 'rgb':
        return transformRGBtoHSB(value as RGBColor)
      case 'hex':
      default:
        return transformHEXtoHSB((value || 'ffffff') as HEXColor)
    }
  },
  set: (value) => {
    switch (props.format) {
      case 'hsb':
        return value
      case 'rgb':
        return transformHSBtoRGB(value)
      case 'hex':
      default:
        return transformHSBtoHEX(value)
    }
  }
})

function useColorDraggable(targetElement: MaybeRefOrGetter<HTMLElement | null>,
  containerElement: MaybeRefOrGetter<HTMLElement | null>,
  axis: 'x' | 'y' | 'both' = 'both',
  initialPosition = { x: 0, y: 0 }
) {
  const position = ref<{ x: number, y: number }>(initialPosition)
  const pressedDelta = ref<{ x: number, y: number }>()
  const targetRect = useElementBounding(targetElement)
  const containerRect = useElementBounding(containerElement)

  function start(event: PointerEvent) {
    const container = toValue(containerElement)

    pressedDelta.value = {
      x: event.clientX - (container ? event.clientX - containerRect.left.value + container.scrollLeft : targetRect.left.value),
      y: event.clientY - (container ? event.clientY - containerRect.top.value + container.scrollTop : targetRect.top.value)
    }

    move(event)
  }

  function move(event: PointerEvent) {
    if (!pressedDelta.value) return

    const container = toValue(containerElement)
    let { x, y } = position.value

    if (container && (axis === 'x' || axis === 'both')) {
      x = Math.min(Math.max(0, (event.clientX - pressedDelta.value.x) / container.scrollWidth * 100), 100)
    }

    if (container && (axis === 'y' || axis === 'both')) {
      y = Math.min(Math.max(0, (event.clientY - pressedDelta.value.y) / container.scrollHeight * 100), 100)
    }

    position.value = { x, y }
  }

  function end() {
    if (!pressedDelta.value) {
      return
    }

    pressedDelta.value = undefined
  }

  if (isClient) {
    useEventListener(containerElement, 'pointerdown', start)
    useEventListener(window, 'pointermove', move)
    useEventListener(window, 'pointerup', end)
  }

  return {
    position
  }
}

const selectorRef = ref<HTMLDivElement | null>(null)
const selectorThumbRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const trackThumbRef = ref<HTMLDivElement | null>(null)

const { position: selectorThumbPosition } = useColorDraggable(selectorThumbRef, selectorRef, 'both', {
  x: modelValue.value.s,
  y: normalizeBrightness(modelValue.value.b)
})

const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, 'y', {
  x: 0,
  y: normalizeHue(modelValue.value.h, 'right')
})

watchThrottled([selectorThumbPosition, trackThumbPosition], () => {
  modelValue.value = normalizeHSB({
    h: normalizeHue(trackThumbPosition.value.y),
    s: selectorThumbPosition.value.x,
    b: normalizeBrightness(selectorThumbPosition.value.y)
  })
}, { throttle: props.throttle })

watch(modelValue, (hsb) => {
  const newPosSelector = { x: hsb.s, y: normalizeBrightness(hsb.b) }
  if (selectorThumbPosition.value.x !== newPosSelector.x && selectorThumbPosition.value.y !== newPosSelector.y) {
    selectorThumbPosition.value = newPosSelector
  }

  const newPosTrack = { x: 0, y: normalizeHue(hsb.h, 'right') }
  if (trackThumbPosition.value.x !== newPosTrack.x && trackThumbPosition.value.y !== newPosTrack.y) {
    trackThumbPosition.value = newPosTrack
  }
})

const trackThumbColor = computed(() => transformHSBtoHEX({
  h: normalizeHue(trackThumbPosition.value.y),
  b: 100,
  s: 100
}))

const selectorStyle = computed(() => ({
  backgroundColor: `#${trackThumbColor.value}`
}))

const selectorThumbStyle = computed(() => ({
  left: `${selectorThumbPosition.value.x}%`,
  top: `${selectorThumbPosition.value.y}%`
}))

const trackThumbStyle = computed(() => ({
  backgroundColor: `#${trackThumbColor.value}`,
  top: `${trackThumbPosition.value.y}%`
}))

const ui = colorPicker({
  size: props.size
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.picker({ class: props.ui?.picker })" :data-disabled="disabled ? true : undefined">
      <div
        ref="selectorRef"
        :class="ui.selector({ class: props.ui?.selector })"
        :style="selectorStyle"
      >
        <div :class="ui.selectorBackground({ class: props.ui?.selectorBackground })" data-color-picker-background>
          <div ref="selectorThumbRef" :class="ui.selectorThumb({ class: props.ui?.selectorThumb })" :style="selectorThumbStyle" />
        </div>
      </div>
      <div
        ref="trackRef"
        :class="ui.track({ class: props.ui?.track })"
        data-color-picker-track
      >
        <div ref="trackThumbRef" :class="ui.trackThumb({ class: props.ui?.trackThumb })" :style="trackThumbStyle" />
      </div>
    </div>
  </Primitive>
</template>

<style>
[data-color-picker-background] {
  background-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

[data-color-picker-track] {
  background-image: linear-gradient(0deg, red 0, #f0f 17%, #00f 33%, #0ff 50%, #0f0 67%, #ff0 83%, red);
}
</style>
