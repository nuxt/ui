<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/color-picker'
import type { PopoverProps } from './Popover.vue'
import type { HSBColor } from '../types/color'

const appConfig = _appConfig as AppConfig & { ui: { colorPicker: Partial<typeof theme> } }

const colorPicker = tv({ extend: tv(theme), ...(appConfig.ui?.colorPicker || {}) })

type ColorPickerVariants = VariantProps<typeof colorPicker>

export type ColorPickerFormat = 'hex' | 'rgb'

export type ColorPickerProps<F> = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  inline?: boolean
  disabled?: boolean
  defaultValue?: any
  format?: F
  size?: ColorPickerVariants['size']
  popover?: PopoverProps
  class?: any
  ui?: Partial<typeof colorPicker.slots>
}

export interface ColorPickerSlots {
  trigger(props: { open: boolean }): any
}
</script>

<script setup lang="ts" generic="F extends ColorPickerFormat">
import { ref } from 'vue'
import { Primitive } from 'radix-vue'
import { createReusableTemplate, useEventListener, useElementBounding, watchPausable } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import UPopover from './Popover.vue'
import { normalizeHSB, transformHEXtoHSB, transformHSBtoHEX } from '../utils/color'

const props = withDefaults(defineProps<ColorPickerProps<F>>(), {
  format: 'hex'
})
defineSlots<ColorPickerSlots>()
const modelValue = defineModel<any>({
  get: (value) => {
    return transformHEXtoHSB(value)
  },
  set: (value) => {
    return transformHSBtoHEX(value)
  }
})

function useColorDraggable(
  targetElement: MaybeRefOrGetter<HTMLElement | null>,
  containerElement: MaybeRefOrGetter<HTMLElement | null>,
  axis: 'x' | 'y' | 'both' = 'both',
  initialPosition: { x: number, y: number } = { x: 0, y: 0 }
) {
  const position = ref(initialPosition)
  const pressedDelta = ref()

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
  y: 100 - modelValue.value.b
})
const { position: trackThumbPosition } = useColorDraggable(trackThumbRef, trackRef, 'y', {
  x: 0,
  y: (modelValue.value.h * 100) / 360
})

const trackThumbColor = computed(() => transformHSBtoHEX({ h: modelValue.value.h, b: 100, s: 100 }))
const pickedColor = computed(() => transformHSBtoHEX(modelValue.value))

watch([selectorThumbPosition, trackThumbPosition], () => {
  pause()

  modelValue.value = normalizeHSB({
    h: (trackThumbPosition.value.y / 100) * 360,
    s: selectorThumbPosition.value.x,
    b: 100 - selectorThumbPosition.value.y
  })

  nextTick(resume)
})

const { resume, pause } = watchPausable(modelValue, (hsb) => {
  selectorThumbPosition.value = {
    x: hsb.s,
    y: 100 - hsb.b
  }

  trackThumbPosition.value = {
    x: 0,
    y: (hsb.h * 100) / 360
  }
})

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

const [DefinePickerTemplate, PickerTemplate] = createReusableTemplate()

const ui = colorPicker({
  size: props.size
})
</script>

<template>
  <DefinePickerTemplate>
    <div class="absolute -mt-6">
      {{ modelValue }}
    </div>
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
  </DefinePickerTemplate>

  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <PickerTemplate v-if="props.inline" />
    <UPopover v-else v-bind="props.popover">
      <template #default="{ open }">
        <slot name="trigger" :open="open">
          <button :class="ui.trigger({ class: props.ui?.trigger })" :disabled="props.disabled" type="button">
            <span :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" :style="{ backgroundColor: `#${pickedColor}` }" />
          </button>
        </slot>
      </template>
      <template #content>
        <PickerTemplate :class="ui.triggerContent({ class: props.ui?.triggerContent })" />
      </template>
    </UPopover>
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
