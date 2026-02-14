<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-rating'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputRating = ComponentConfig<typeof theme, AppConfig, 'inputRating'>

export interface InputRatingProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The rating value (0 to max).
   * @defaultValue 0
   */
  modelValue?: number
  /**
   * The default rating value.
   * @defaultValue 0
   */
  defaultValue?: number
  /**
   * Maximum rating value.
   * @defaultValue 5
   */
  max?: number
  /**
   * Allow half star ratings.
   * @defaultValue false
   */
  allowHalf?: boolean
  /**
   * Make the rating readonly (non-interactive).
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Disable the rating.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Allow clearing the rating by clicking on the current value.
   * @defaultValue false
   */
  clearable?: boolean
  /**
   * Show hover preview.
   * @defaultValue true
   */
  hoverable?: boolean
  /**
   * The icon to use for stars.
   * @defaultValue appConfig.ui.icons.star
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon to use for empty stars (outline version).
   * If not provided, uses the same icon as `icon` but with outline style.
   * @IconifyIcon
   */
  emptyIcon?: IconProps['name']
  /**
   * @defaultValue 'primary'
   */
  color?: InputRating['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: InputRating['variants']['size']
  /** Form field name. */
  name?: string
  /** Form field id. */
  id?: string
  /** Form field required. */
  required?: boolean
  /**
   * The orientation of the rating.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  class?: any
  ui?: InputRating['slots']
}

export interface InputRatingEmits {
  'update:modelValue': [value: number]
  'change': [event: Event]
}

export interface InputRatingSlots {
  star(props: { index: number, value: number, filled: boolean, half: boolean }): any
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { RatingRoot, RatingItem, RatingItemIndicator, useForwardProps } from 'reka-ui'
import { reactivePick, useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputRatingProps>(), {
  max: 5,
  allowHalf: false,
  readonly: false,
  defaultValue: 0,
  orientation: 'horizontal',
  hoverable: true,
  clearable: false
})

const emits = defineEmits<InputRatingEmits>()
defineSlots<InputRatingSlots>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: false
})

const appConfig = useAppConfig() as InputRating['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as'))

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled: formDisabled, ariaAttrs } = useFormField<InputRatingProps>(props)
const fieldId = _id.value ?? useId()

// Functional disabled: includes readonly for interaction blocking
const disabled = computed(() => formDisabled.value || props.disabled || props.readonly)
// Visual disabled: only when explicitly disabled (not readonly)
const isVisuallyDisabled = computed(() => formDisabled.value || props.disabled)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputRating || {}) })({
  size: size.value,
  color: color.value,
  orientation: props.orientation,
  readonly: props.readonly && !props.disabled, // Only apply readonly styles if not disabled
  disabled: isVisuallyDisabled.value // Only apply disabled styles when explicitly disabled
}))

const starIcon = computed(() => props.icon || (appConfig.ui.icons as any).star || 'i-lucide-star')
const emptyStarIcon = computed(() => {
  if (props.emptyIcon) return props.emptyIcon
  return starIcon.value
})

function onUpdate(value: number) {
  modelValue.value = value

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const changeEvent = new Event('change', { target: { value } })
  emits('change', changeEvent)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <RatingRoot
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="fieldId"
    v-model="modelValue"
    :length="props.max"
    :step="props.allowHalf ? 0.5 : 1"
    :disabled="disabled"
    :hoverable="props.hoverable && !disabled"
    :clearable="props.clearable"
    :orientation="orientation"
    :name="name"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <template #default="{ items }">
      <RatingItem
        v-for="item in items"
        :key="item"
        :item="item"
        data-slot="star"
        :class="ui.star({ class: props.ui?.star })"
      >
        <template #default="{ steps }">
          <slot
            name="star"
            :index="item"
            :value="modelValue ?? 0"
            :filled="(modelValue ?? 0) >= item"
            :half="!!props.allowHalf && (modelValue ?? 0) >= item - 0.5 && (modelValue ?? 0) < item"
          >
            <!-- Empty icon as background -->
            <UIcon
              :name="emptyStarIcon"
              :class="ui.emptyIcon({ class: props.ui?.emptyIcon })"
            />

            <!-- Indicators overlaid for each step -->
            <RatingItemIndicator
              v-for="step in steps"
              :key="step"
              :step="step"
              :aria-label="`Rate ${step} ${step === 1 ? 'star' : 'stars'} out of ${props.max}`"
              :class="ui.indicator({ class: props.ui?.indicator })"
            >
              <UIcon
                :name="starIcon"
                :class="ui.icon({ class: props.ui?.icon })"
              />
            </RatingItemIndicator>
          </slot>
        </template>
      </RatingItem>
    </template>
  </RatingRoot>
</template>
