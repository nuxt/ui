<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/color-picker'
import type { PopoverProps } from './Popover.vue'
// import type { HSBColor } from '../types/color'

const appConfig = _appConfig as AppConfig & { ui: { colorPicker: Partial<typeof theme> } }

const colorPicker = tv({ extend: tv(theme), ...(appConfig.ui?.colorPicker || {}) })

type ColorPickerVariants = VariantProps<typeof colorPicker>

export type ColorPickerFormat = 'hex' | 'rgb'

export type ColorPickerProps = {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  inline?: boolean
  disabled?: boolean
  defaultValue?: any
  format?: ColorPickerFormat
  size?: ColorPickerVariants['size']
  popover?: PopoverProps
  class?: any
  ui?: Partial<typeof colorPicker.slots>
}

export interface ColorPickerSlots {
  trigger(props: { open: boolean }): any
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Primitive } from 'radix-vue'
import { createReusableTemplate, useEventListener, useElementBounding } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import UPopover from './Popover.vue'
import { transformHEXtoHSB, transformHSBtoHEX } from '../utils/color'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  format: 'hex'
})
defineSlots<ColorPickerSlots>()
const modelValue = defineModel(undefined)

function useColorDraggable(
  targetElement: MaybeRefOrGetter<HTMLElement | null>,
  containerElement: MaybeRefOrGetter<HTMLElement | null>,
  axis: 'x' | 'y' | 'both' = 'both'
) {
  const position = ref({ x: 0, y: 0 })
  const percentage = ref({ x: 0, y: 0 })
  const pressedDelta = ref()

  const targetRect = useElementBounding(targetElement)
  const containerRect = useElementBounding(containerElement)

  function start(event: PointerEvent) {
    const container = toValue(containerElement)

    pressedDelta.value = {
      x: event.clientX - (container ? event.clientX - containerRect.left.value + container.scrollLeft : targetRect.left.value) + targetRect.width.value / 2,
      y: event.clientY - (container ? event.clientY - containerRect.top.value + container.scrollTop : targetRect.top.value) + targetRect.width.value / 2
    }

    move(event)
  }

  function move(event: PointerEvent) {
    if (!pressedDelta.value) return

    const container = toValue(containerElement)
    let { x, y } = position.value

    if (container && (axis === 'x' || axis === 'both')) {
      x = Math.min(Math.max(0, event.clientX - pressedDelta.value.x), container.scrollWidth - targetRect.width.value - 1)
    }

    if (container && (axis === 'y' || axis === 'both')) {
      y = Math.min(Math.max(0, event.clientY - pressedDelta.value.y), container.scrollHeight - targetRect.height.value - 1)
    }

    position.value = { x, y }
    percentage.value = {
      x: (x / (container ? container.scrollWidth - targetRect.width.value : targetRect.width.value)) * 100,
      y: (y / (container ? container.scrollHeight - targetRect.height.value : targetRect.height.value)) * 100
    }
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
    position,
    percentage: computed(() => percentage.value)
  }
}

const pickedValue = computed({
  get() {
    return transformHEXtoHSB(modelValue.value)
  },
  set(value) {
    modelValue.value = transformHSBtoHEX(value)
  }
})

const selectorRef = ref<HTMLDivElement | null>(null)
const selectorThumbRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const trackThumbRef = ref<HTMLDivElement | null>(null)

const { position: selectorThumbPosition, percentage: selectorPercentage } = useColorDraggable(selectorThumbRef, selectorRef)
const { position: trackThumbPosition, percentage: trackPercentage } = useColorDraggable(trackThumbRef, trackRef, 'y')

const trackThumbColor = computed(() => transformHSBtoHEX({ h: pickedValue.value.h, b: 100, s: 100 }))
const pickedColor = computed(() => transformHSBtoHEX(pickedValue.value))

watchEffect(() => {
  pickedValue.value = {
    h: (trackPercentage.value.y / 100) * 360,
    s: selectorPercentage.value.x,
    b: 100 - selectorPercentage.value.y
  }
})

const selectorThumbStyle = computed(() => ({
  left: `${selectorThumbPosition.value.x}px`,
  top: `${selectorThumbPosition.value.y}px`
}))

const trackThumbStyle = computed(() => ({
  backgroundColor: trackThumbColor.value,
  top: `${trackThumbPosition.value.y}px`
}))

const [DefinePickerTemplate, PickerTemplate] = createReusableTemplate()

const ui = colorPicker({
  size: props.size
})
</script>

<template>
  <DefinePickerTemplate>
    <div :class="ui.picker({ class: props.ui?.picker })" :data-disabled="disabled ? true : undefined">
      <div
        ref="selectorRef"
        :class="ui.selector({ class: props.ui?.selector })"
        :style="{ backgroundColor: trackThumbColor }"
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
            <span :class="ui.triggerIcon({ class: props.ui?.triggerIcon })" :style="{ backgroundColor: pickedColor }" />
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
