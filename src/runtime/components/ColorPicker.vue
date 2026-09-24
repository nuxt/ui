<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { MaybeRefOrGetter } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/color-picker'
import type { HSLObject } from 'colortranslator'
import type { ComponentConfig } from '../types/tv'

type ColorPicker = ComponentConfig<typeof theme, AppConfig, 'colorPicker'>

interface HSVColor {
  h: number
  s: number
  v: number
  a?: number
}

function HSLtoHSV(hsl: HSLObject): HSVColor {
  const x = hsl.S * (hsl.L < 50 ? hsl.L : 100 - hsl.L)
  const v = hsl.L + (x / 100)

  return {
    h: hsl.H,
    s: hsl.L === 0 ? hsl.S : 2 * x / v,
    v,
    a: hsl.A != null ? hsl.A * 100 : undefined
  }
}

function HSVtoHSL(hsv: HSVColor): HSLObject {
  const x = (200 - hsv.s) * hsv.v / 100

  return {
    H: hsv.h,
    S: x === 0 || x === 200 ? 0 : Math.round(hsv.s * hsv.v / (x <= 100 ? x : 200 - x)),
    L: x / 2,
    A: hsv.a != null ? hsv.a / 100 : undefined
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
   * @defaultValue 50
   */
  throttle?: number
  /**
   * Disable the color picker
   */
  disabled?: boolean
  /**
   * The default value of the color picker
   * @defaultValue '#FFFFFF'
   */
  defaultValue?: string
  /**
   * Format of the color
   * @defaultValue 'hex'
   */
  format?: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'lab' | 'lch' | 'hwb'
  /**
   * Show the track for picking transparency of the color
   */
  alphaTrack?: boolean
  /**
   * The maximum number of decimals for the outputs
   * @defaultValue 4
   */
  decimals?: number
  /**
   * @defaultValue 'md'
   */
  size?: ColorPicker['variants']['size']
  class?: any
  ui?: ColorPicker['slots']
}

</script>

<script setup lang="ts">
import { ref, nextTick, computed, toValue, useTemplateRef, watch, triggerRef } from 'vue'
import { Primitive } from 'reka-ui'
import { useEventListener, useElementBounding, watchThrottled, watchPausable } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import { ColorTranslator } from 'colortranslator'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { tv } from '../utils/tv'

const _props = withDefaults(defineProps<ColorPickerProps>(), {
  format: 'hex',
  throttle: 50,
  defaultValue: '#FFFFFF',
  decimals: 4
})

const props = useComponentProps('colorPicker', _props)

const modelValue = defineModel<string>(undefined)

const appConfig = useAppConfig() as ColorPicker['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.colorPicker || {}) })({
  size: props.size
}))

const pickedColor = computed<HSVColor>({
  get() {
    try {
      const color = ColorTranslator.toHSLAObject(modelValue.value || props.defaultValue)

      return HSLtoHSV(color)
    } catch (_) {
      return { h: 0, s: 0, v: 100 }
    }
  },
  set(value) {
    const color = new ColorTranslator(HSVtoHSL(value), {
      labUnit: 'percent',
      cmykUnit: 'percent',
      cmykFunction: 'cmyk',
      decimals: props.decimals
    })

    switch (props.format) {
      case 'rgb':
        modelValue.value = props.alphaTrack ? color.RGBA : color.RGB
        break
      case 'hsl':
        modelValue.value = props.alphaTrack ? color.HSLA : color.HSL
        break
      case 'cmyk':
        modelValue.value = props.alphaTrack ? color.CMYKA : color.CMYK
        break
      case 'lab':
        modelValue.value = props.alphaTrack ? color.CIELabA : color.CIELab
        break
      case 'lch':
        modelValue.value = props.alphaTrack ? color.LCHA : color.LCH
        break
      case 'hwb':
        modelValue.value = props.alphaTrack ? color.HWBA : color.HWB
        break
      case 'hex':
      default:
        modelValue.value = props.alphaTrack ? color.HEXA : color.HEX
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

function normalizeAlpha(alpha: number): number {
  return 100 - alpha
}

const selectorRef = useTemplateRef<HTMLDivElement>('selectorRef')
const selectorThumbRef = useTemplateRef<HTMLDivElement>('selectorThumbRef')
const trackRef = useTemplateRef<HTMLDivElement>('trackRef')
const trackThumbRef = useTemplateRef<HTMLDivElement>('trackThumbRef')
const alphaTrackRef = useTemplateRef<HTMLDivElement>('alphaTrackRef')
const alphaTrackThumbRef = useTemplateRef<HTMLDivElement>('alphaTrackThumbRef')

// eslint-disable-next-line vue/no-dupe-keys
const disabled = computed(() => props.disabled)

const { position: selectorThumbPosition } = useColorDraggable(selectorThumbRef, selectorRef, 'both', {
  x: pickedColor.value.s,
  y: normalizeBrightness(pickedColor.value.v)
}, disabled)

const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, 'y', {
  x: 0,
  y: normalizeHue(pickedColor.value.h, 'right')
}, disabled)

const { position: alphaTrackThumbPosition } = useColorDraggable(alphaTrackThumbRef, alphaTrackRef, 'y', {
  x: 0,
  y: normalizeAlpha(pickedColor.value.a ?? 0)
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
  alphaTrackThumbPosition.value = {
    x: 0,
    y: normalizeAlpha(hsb.a ?? 0)
  }
})

watchThrottled([selectorThumbPosition, trackThumbPosition, alphaTrackThumbPosition], () => {
  pauseWatchColor()

  pickedColor.value = {
    h: normalizeHue(trackThumbPosition.value.y),
    s: selectorThumbPosition.value.x,
    v: normalizeBrightness(selectorThumbPosition.value.y),
    a: normalizeAlpha(alphaTrackThumbPosition.value.y)
  }

  nextTick(resumeWatchColor)
}, { throttle: () => props.throttle })

watch([() => props.alphaTrack, () => props.format, () => props.decimals], () => {
  triggerRef(modelValue)
})

const trackThumbColor = computed(() => ColorTranslator.toHEX(HSVtoHSL({
  h: normalizeHue(trackThumbPosition.value.y),
  s: 100,
  v: 100
})))

const selectorStyle = computed(() => ({
  backgroundColor: trackThumbColor.value
}))

const selectorThumbStyle = computed(() => ({
  backgroundColor: ColorTranslator.toHEX(modelValue.value || props.defaultValue),
  left: `${selectorThumbPosition.value.x}%`,
  top: `${selectorThumbPosition.value.y}%`
}))

const trackThumbStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
  top: `${trackThumbPosition.value.y}%`
}))

const alphaTrackThumbStyle = computed(() => ({
  backgroundColor: 'white',
  backgroundImage: `linear-gradient(0deg, ${modelValue.value || props.defaultValue})`,
  top: `${alphaTrackThumbPosition.value.y}%`
}))
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" :data-disabled="disabled ? true : undefined">
    <div data-slot="picker" :class="ui.picker({ class: props.ui?.picker })">
      <div
        ref="selectorRef"
        data-slot="selector"
        :class="ui.selector({ class: props.ui?.selector })"
        :style="selectorStyle"
      >
        <div data-slot="selectorBackground" :class="ui.selectorBackground({ class: props.ui?.selectorBackground })" data-color-picker-background>
          <div
            ref="selectorThumbRef"
            data-slot="selectorThumb"
            :class="ui.selectorThumb({ class: props.ui?.selectorThumb })"
            :style="selectorThumbStyle"
            :data-disabled="disabled ? true : undefined"
          />
        </div>
      </div>
      <div
        ref="trackRef"
        data-slot="track"
        :class="ui.track({ class: props.ui?.track })"
        data-color-picker-track
      >
        <div
          ref="trackThumbRef"
          data-slot="trackThumb"
          :class="ui.trackThumb({ class: props.ui?.trackThumb })"
          :style="trackThumbStyle"
          :data-disabled="disabled ? true : undefined"
        />
      </div>
      <div
        v-if="props.alphaTrack"
        ref="alphaTrackRef"
        data-slot="track"
        :class="ui.track({ class: props.ui?.track })"
        :style="{ '--current-color': ColorTranslator.toHEX(modelValue || props.defaultValue) }"
        data-color-picker-alpha
      >
        <div
          ref="alphaTrackThumbRef"
          data-slot="trackThumb"
          :class="ui.trackThumb({ class: props.ui?.trackThumb })"
          :style="alphaTrackThumbStyle"
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

[data-color-picker-alpha] {
  background-image: linear-gradient(to top, transparent 0%, var(--current-color));
  &::before {
    content: "";
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%222%22%20height%3D%222%22%20viewBox%3D%220%200%202%202%22%3E%3Cpath%20fill%3D%22%23c0c0c030%22%20d%3D%22M0%200h2v2H0z%22%2F%3E%3Cpath%20d%3D%22M0%200h1v2h1V1H0Z%22%20fill%3D%22%23c0c0c050%22%2F%3E%3C%2Fsvg%3E");
    background-size: 8px 8px;
    background-position: center, 4px 4px;
    border-radius: inherit;
    z-index: -1;
  }
}
</style>
