<script lang="ts">
import type { SliderRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/slider'
import type { TooltipProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type Slider = ComponentConfig<typeof theme, AppConfig, 'slider'>

export interface SliderProps extends Pick<SliderRootProps, 'name' | 'disabled' | 'inverted' | 'min' | 'max' | 'step' | 'minStepsBetweenThumbs'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: Slider['variants']['size']
  /**
   * @defaultValue 'primary'
   */
  color?: Slider['variants']['color']
  /**
   * The orientation of the slider.
   * @defaultValue 'horizontal'
   */
  orientation?: Slider['variants']['orientation']
  /**
   * Display a tooltip around the slider thumbs with the current value.
   * `{ disableClosingTrigger: true }`{lang="ts-type"}
   * @defaultValue false
   */
  tooltip?: boolean | TooltipProps
  /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
  defaultValue?: number | number[]
  class?: any
  ui?: Slider['slots']
}

export interface SliderEmits {
  change: [event: Event]
}
</script>

<script setup lang="ts" generic="T extends number | number[]">
import { computed } from 'vue'
import { SliderRoot, SliderRange, SliderTrack, SliderThumb } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UTooltip from './Tooltip.vue'

const _props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal'
})
const emits = defineEmits<SliderEmits>()

const props = useComponentProps<SliderProps>('slider', _props)

const modelValue = defineModel<T>()

const appConfig = useAppConfig() as Slider['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'orientation', 'min', 'max', 'step', 'minStepsBetweenThumbs', 'inverted'), emits)

const { id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField<SliderProps>(_props)

const defaultSliderValue = computed(() => {
  if (typeof props.defaultValue === 'number') {
    return [props.defaultValue]
  }
  return props.defaultValue
})

const sliderValue = computed({
  get() {
    if (typeof modelValue.value === 'number') {
      return [modelValue.value]
    }
    return (modelValue.value as number[]) ?? defaultSliderValue.value
  },
  set(value) {
    modelValue.value = (value?.length !== 1 ? value : value[0]) as T
  }
})

const thumbs = computed(() => sliderValue.value?.length ?? 1)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.slider || {}) })({
  disabled: disabled.value,
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  orientation: props.orientation
}))

function onChange(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
}
</script>

<template>
  <SliderRoot
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-model="sliderValue"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :default-value="defaultSliderValue"
    @update:model-value="emitFormInput()"
    @value-commit="onChange"
  >
    <SliderTrack data-slot="track" :class="ui.track({ class: props.ui?.track })">
      <SliderRange data-slot="range" :class="ui.range({ class: props.ui?.range })" />
    </SliderTrack>

    <template v-for="thumb in thumbs" :key="thumb">
      <UTooltip
        v-if="!!props.tooltip"
        :text="thumbs > 1 ? String(sliderValue?.[thumb - 1]) : String(sliderValue)"
        disable-closing-trigger
        v-bind="(typeof props.tooltip === 'object' ? props.tooltip : {})"
      >
        <SliderThumb data-slot="thumb" :class="ui.thumb({ class: props.ui?.thumb })" :aria-label="thumbs === 1 ? 'Thumb' : `Thumb ${thumb} of ${thumbs}`" />
      </UTooltip>
      <SliderThumb v-else data-slot="thumb" :class="ui.thumb({ class: props.ui?.thumb })" :aria-label="thumbs === 1 ? 'Thumb' : `Thumb ${thumb} of ${thumbs}`" />
    </template>
  </SliderRoot>
</template>
