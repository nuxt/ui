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
import { computed, ref, useId } from 'vue'
import { RadioGroupRoot, RadioGroupItem, useForwardProps } from 'reka-ui'
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
  defaultValue: 0
})

const emits = defineEmits<InputRatingEmits>()
defineSlots<InputRatingSlots>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: false
})

const hoveredValue = ref(0)

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
  readonly: props.readonly && !props.disabled, // Only apply readonly styles if not disabled
  disabled: isVisuallyDisabled.value // Only apply disabled styles when explicitly disabled
}))

const currentValue = computed(() => {
  const value = modelValue.value ?? props.defaultValue ?? 0
  return Math.max(0, Math.min(value, props.max))
})

const starIcon = computed(() => props.icon || (appConfig.ui.icons as any).star || 'i-lucide-star')
const emptyStarIcon = computed(() => {
  if (props.emptyIcon) return props.emptyIcon
  return starIcon.value
})

const iconSizeClass = computed(() => {
  const sizeMap: Record<string, string> = {
    xs: 'size-3',
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
    xl: 'size-7'
  }
  return sizeMap[size.value || 'md'] || 'size-5'
})

const stars = computed(() => {
  return Array.from({ length: props.max }, (_, i) => i + 1)
})

function getStepsForStar(star: number) {
  if (props.allowHalf) {
    return [star - 0.5, star]
  }
  return [star]
}

function getStarState(index: number): { filled: boolean, half: boolean } {
  // Don't show hover effect when disabled
  const value = (disabled.value ? 0 : hoveredValue.value) || currentValue.value
  const starValue = index

  if (value >= starValue) {
    return { filled: true, half: false }
  }

  if (props.allowHalf && value >= starValue - 0.5) {
    return { filled: false, half: true }
  }

  return { filled: false, half: false }
}

function onUpdate(value: string) {
  const newValue = Number(value)
  modelValue.value = newValue

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const changeEvent = new Event('change', { target: { value: newValue } })
  emits('change', changeEvent)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <RadioGroupRoot
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="fieldId"
    :model-value="(modelValue ?? 0).toString()"
    :name="name"
    :disabled="disabled"
    :orientation="'horizontal'"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
    @mouseleave="hoveredValue = 0"
  >
    <div
      v-for="star in stars"
      :key="star"
      :data-slot="`star-${star}`"
      :class="ui.star({ class: props.ui?.star })"
    >
      <slot
        name="star"
        :index="star"
        :value="currentValue"
        :filled="getStarState(star).filled"
        :half="getStarState(star).half"
      >
        <!-- Empty star (background) - only show when not completely filled -->
        <UIcon
          v-if="!getStarState(star).filled"
          :name="emptyStarIcon"
          :class="[iconSizeClass, 'text-muted']"
        />

        <!-- Filled star (overlay) -->
        <div
          v-if="getStarState(star).filled"
          data-slot="starFilled"
          :class="ui.starFilled({ class: props.ui?.starFilled })"
        >
          <UIcon
            :name="starIcon"
            :class="iconSizeClass"
          />
        </div>

        <!-- Half star (overlay with clip) -->
        <div
          v-else-if="getStarState(star).half"
          data-slot="starHalf"
          :class="ui.starHalf({ class: props.ui?.starHalf })"
        >
          <UIcon
            :name="starIcon"
            :class="[iconSizeClass, ui.starHalf({ class: props.ui?.starHalf })]"
          />
        </div>

        <RadioGroupItem
          v-for="step in getStepsForStar(star)"
          :key="step"
          :value="step.toString()"
          :aria-label="`Rate ${step} ${step === 1 ? 'star' : 'stars'} out of ${props.max}`"
          class="absolute inset-0 focus:outline-none"
          :class="[
            allowHalf && step % 1 !== 0
              ? 'w-1/2 left-0'
              : allowHalf
                ? 'w-1/2 left-1/2'
                : 'w-full'
          ]"
          @mouseenter="!disabled && (hoveredValue = step)"
          @focus="!disabled && (hoveredValue = step)"
          @blur="hoveredValue = 0"
        />
      </slot>
    </div>
  </RadioGroupRoot>
</template>
