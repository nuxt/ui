<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/color-picker'
import type { PopoverProps } from './Popover.vue'

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
  modelValue?: any
  defaultValue?: any
  format?: ColorPickerFormat
  size?: ColorPickerVariants['size']
  popover?: PopoverProps
  class?: any
  ui?: Partial<typeof colorPicker.slots>
}

export interface ColorPickerEmits {
  (e: 'update:modelValue', value: any): void
}

export interface ColorPickerSlots {
  trigger(props: { open: boolean }): any
}
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Primitive } from 'radix-vue'
import { createReusableTemplate } from '@vueuse/core'
import UPopover from './Popover.vue'

const props = withDefaults(defineProps<ColorPickerProps>(), {
  format: 'hex'
})
defineEmits<ColorPickerEmits>()
defineSlots<ColorPickerSlots>()

const selectorRef = ref<HTMLDivElement | null>(null)
const backgroundThumbRef = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const trackThumbRef = ref<HTMLDivElement | null>(null)

const selectorColor = ref<string>('#f00000')
const backgroundColor = ref<string>('#ffffff')
const trackColor = ref<string>('#f00000')
const pickedColor = ref<string>('#f00000')

const [DefinePickerTemplate, PickerTemplate] = createReusableTemplate()

const ui = colorPicker({
  size: props.size
})
</script>

<template>
  <DefinePickerTemplate>
    <div :class="ui.picker({ class: props.ui?.picker })" :data-disabled="disabled ? true : undefined">
      <div ref="selectorRef" :class="ui.selector({ class: props.ui?.selector })" :style="{ backgroundColor: selectorColor }">
        <div :class="ui.background({ class: props.ui?.background })" data-color-picker-background>
          <div ref="backgroundThumbRef" :class="ui.backgroundThumb({ class: props.ui?.backgroundThumb })" :style="{ backgroundColor }" />
        </div>
      </div>
      <div ref="trackRef" :class="ui.track({ class: props.ui?.track })" data-color-picker-track>
        <div ref="trackThumbRef" :class="ui.trackThumb({ class: props.ui?.trackThumb })" :style="{ backgroundColor: trackColor }" />
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
  background-image: linear-gradient(0deg, red 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);
}
</style>
