<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/color-picker'
import { tv } from '../utils/tv'
import type { HSLObject } from 'colortranslator'

const appConfigColorPicker = _appConfig as AppConfig & { ui: { colorPicker: Partial<typeof theme> } }

const colorPicker = tv({ extend: tv(theme), ...(appConfigColorPicker.ui?.colorPicker || {}) })

type ColorPickerVariants = VariantProps<typeof colorPicker>

type HSVColor = {
  h: number
  s: number
  v: number
}

function HSLtoHSV(hsl: HSLObject): HSVColor {
  const x = hsl.S * (hsl.L < 50 ? hsl.L : 100 - hsl.L)
  const v = hsl.L + (x / 100)

  return {
    h: hsl.H,
    s: hsl.L === 0 ? hsl.S : 2 * x / v,
    v
  }
}

function HSVtoHSL(hsv: HSVColor): HSLObject {
  const x = (200 - hsv.s) * hsv.v / 100

  return {
    H: hsv.h,
    S: x === 0 || x === 200 ? 0 : Math.round(hsv.s * hsv.v / (x <= 100 ? x : 200 - x)),
    L: Math.round(x / 2)
  }
}

export type ColorPickerProps = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Throttle time in ms for the color picker
   */
  throttle?: number
  /**
   * Disable the color picker
   */
  disabled?: boolean
  /**
   * The default value of the color picker
   */
  defaultValue?: string
  /**
   * Format of the color
   * @defaultValue 'hex'
   */
  format?: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'lab'
  /**
   * @defaultValue 'md'
   */
  size?: ColorPickerVariants['size']
  class?: any
  ui?: Partial<typeof colorPicker.slots>
}
</script>

<script setup lang="ts">
import { ref, nextTick, computed, toValue } from 'vue'
import { Primitive } from 'reka-ui'
import { useEventListener, useElementBounding, watchThrottled, watchPausable } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import { ColorTranslator } from 'colortranslator'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  format: 'hex',
  throttle: 50,
  defaultValue: '#FFFFFF'
})
const modelValue = defineModel<string>(undefined)

const pickedColor = computed<HSVColor>({
  get() {
    try {
      const color = new ColorTranslator(modelValue.value || props.defaultValue)

      return HSLtoHSV(color.HSLObject)
    } catch (_) {
      return { h: 0, s: 0, v: 100 }
    }
  },
  set(value) {
    const color = new ColorTranslator(HSVtoHSL(value), {
      decimals: 2,
      labUnit: 'percent',
      cmykUnit: 'percent',
      cmykFunction: 'cmyk'
    })

    switch (props.format) {
      case 'rgb':
        modelValue.value = color.RGB
        break
      case 'hsl':
        modelValue.value = color.HSL
        break
      case 'cmyk':
        modelValue.value = color.CMYK
        break
      case 'lab':
        modelValue.value = color.CIELab
        break
      case 'hex':
      default:
        modelValue.value = color.HEX
    }
  }
})

function useColorDraggable(targetElement: MaybeRefOrGetter<HTMLElement | null>,
  containerElement: MaybeRefOrGetter<HTMLElement | null>,
  axis: 'x' | 'y' | 'both' = 'both',
  initialPosition = { x: 0, y: 0 },
  disabled?: MaybeRefOrGetter<boolean | undefined>
) {
  const position = ref<{ x: number, y: number }>(initialPosition)
  const pressedDelta = ref<{ x: number, y: number }>()
  const targetRect = useElementBounding(targetElement)
  const containerRect = useElementBounding(containerElement)

  function start(event: PointerEvent) {
    if (toValue(disabled)) return event.preventDefault()

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

function normalizeHue(hue: number, dir: 'left' | 'right' = 'left'): number {
  if (dir === 'right') {
    return (hue * 100) / 360
  }

  return (hue / 100) * 360
}

function normalizeBrightness(brightness: number): number {
  return 100 - brightness
}

const selectorRef = ref<HTMLDivElement | null>(null)
const selectorThumbRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const trackThumbRef = ref<HTMLDivElement | null>(null)

const disabled = computed(() => props.disabled)

const { position: selectorThumbPosition } = useColorDraggable(selectorThumbRef, selectorRef, 'both', {
  x: pickedColor.value.s,
  y: normalizeBrightness(pickedColor.value.v)
}, disabled)

const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, 'y', {
  x: 0,
  y: normalizeHue(pickedColor.value.h, 'right')
}, disabled)

const { pause: pauseWatchColor, resume: resumeWatchColor } = watchPausable(pickedColor, (hsb) => {
  selectorThumbPosition.value = {
    x: hsb.s,
    y: normalizeBrightness(hsb.v)
  }
  trackThumbPosition.value = {
    x: 0,
    y: normalizeHue(hsb.h, 'right')
  }
})

watchThrottled([selectorThumbPosition, trackThumbPosition], () => {
  pauseWatchColor()

  pickedColor.value = {
    h: normalizeHue(trackThumbPosition.value.y),
    s: selectorThumbPosition.value.x,
    v: normalizeBrightness(selectorThumbPosition.value.y)
  }

  nextTick(resumeWatchColor)
}, { throttle: () => props.throttle })

const trackThumbColor = computed(() => new ColorTranslator(HSVtoHSL({
  h: normalizeHue(trackThumbPosition.value.y),
  s: 100,
  v: 100
})).HEX)

const selectorStyle = computed(() => ({
  backgroundColor: trackThumbColor.value
}))

const selectorThumbStyle = computed(() => ({
  backgroundColor: new ColorTranslator(modelValue.value || props.defaultValue).HEX,
  left: `${selectorThumbPosition.value.x}%`,
  top: `${selectorThumbPosition.value.y}%`
}))

const trackThumbStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
  top: `${trackThumbPosition.value.y}%`
}))

const ui = computed(() => colorPicker({
  size: props.size
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })" :data-disabled="disabled ? true : undefined">
    <div :class="ui.picker({ class: props.ui?.picker })">
      <div
        ref="selectorRef"
        :class="ui.selector({ class: props.ui?.selector })"
        :style="selectorStyle"
      >
        <div :class="ui.selectorBackground({ class: props.ui?.selectorBackground })" data-color-picker-background>
          <div
            ref="selectorThumbRef"
            :class="ui.selectorThumb({ class: props.ui?.selectorThumb })"
            :style="selectorThumbStyle"
            :data-disabled="disabled ? true : undefined"
          />
        </div>
      </div>
      <div
        ref="trackRef"
        :class="ui.track({ class: props.ui?.track })"
        data-color-picker-track
      >
        <div
          ref="trackThumbRef"
          :class="ui.trackThumb({ class: props.ui?.trackThumb })"
          :style="trackThumbStyle"
          :data-disabled="disabled ? true : undefined"
        />
      </div>
    </div>
  </Primitive>
</template>

<style scoped>
[data-color-picker-background] {
  background-image: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

[data-color-picker-track] {
  background-image: linear-gradient(0deg, red 0, #f0f 17%, #00f 33%, #0ff 50%, #0f0 67%, #ff0 83%, red);
}
</style>
