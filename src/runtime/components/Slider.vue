<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { SliderRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/slider'
import { tv } from '../utils/tv'

const appConfigSlider = _appConfig as AppConfig & { ui: { slider: Partial<typeof theme> } }

const slider = tv({ extend: tv(theme), ...(appConfigSlider.ui?.slider || {}) })

type SliderVariants = VariantProps<typeof slider>

export interface SliderProps extends Pick<SliderRootProps, 'name' | 'disabled' | 'inverted' | 'min' | 'max' | 'step' | 'minStepsBetweenThumbs'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'md'
   */
  size?: SliderVariants['size']
  /**
   * @defaultValue 'primary'
   */
  color?: SliderVariants['color']
  /**
   * The orientation of the slider.
   * @defaultValue 'horizontal'
   */
  orientation?: SliderRootProps['orientation']
  /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
  defaultValue?: number | number[]
  class?: any
  ui?: Partial<typeof slider.slots>
}

export interface SliderEmits {
  (e: 'update:modelValue', payload: number | number[]): void
  (e: 'change', payload: Event): void
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { SliderRoot, SliderRange, SliderTrack, SliderThumb, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useFormField } from '../composables/useFormField'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal'
})
const emits = defineEmits<SliderEmits>()

const modelValue = defineModel<number | number[]>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'orientation', 'min', 'max', 'step', 'minStepsBetweenThumbs', 'inverted'), emits)

const { id, emitFormChange, emitFormInput, size, color, name, disabled, ariaAttrs } = useFormField<SliderProps>(props)

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
    return modelValue.value ?? defaultSliderValue.value
  },
  set(value) {
    modelValue.value = value?.length !== 1 ? value : value[0]
  }
})

const thumbsCount = computed(() => sliderValue.value?.length ?? 1)

const ui = computed(() => slider({
  disabled: disabled.value,
  size: size.value,
  color: color.value,
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
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :default-value="defaultSliderValue"
    @update:model-value="emitFormInput()"
    @value-commit="onChange"
  >
    <SliderTrack :class="ui.track({ class: props.ui?.track })">
      <SliderRange :class="ui.range({ class: props.ui?.range })" />
    </SliderTrack>

    <SliderThumb v-for="count in thumbsCount" :key="count" :class="ui.thumb({ class: props.ui?.thumb })" />
  </SliderRoot>
</template>
