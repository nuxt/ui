<script lang="ts">
import type { RatingRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-rating'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputRating = ComponentConfig<typeof theme, AppConfig, 'inputRating'>

export interface InputRatingProps extends Pick<RatingRootProps, 'name' | 'disabled' | 'required' | 'clearable' | 'hoverable' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The id of the rating. */
  id?: string
  /**
   * The maximum rating value.
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
   * The icon displayed for each rating value.
   * @defaultValue appConfig.ui.icons.star
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * The icon displayed for empty rating values. Defaults to `icon` when not provided.
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
  /**
   * The orientation of the rating.
   * @defaultValue 'horizontal'
   */
  orientation?: InputRating['variants']['orientation']
  class?: any
  ui?: InputRating['slots']
}

export interface InputRatingEmits {
  change: [event: Event]
}

export interface InputRatingSlots {
  star(props: { index: number, value: number, filled: boolean, half: boolean }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { RatingRoot, RatingItem, RatingItemIndicator } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useForwardProps } from '../composables/useForwardProps'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<InputRatingProps>(), {
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

const props = useComponentProps<InputRatingProps>('inputRating', _props)

const modelValue = defineModel<number>()

const appConfig = useAppConfig() as InputRating['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'clearable', 'required', 'defaultValue'))

const { id, emitFormChange, emitFormInput, size, color, name, disabled: formDisabled, ariaAttrs } = useFormField<InputRatingProps>(_props)

// `readonly` blocks interaction too, but only an explicit `disabled` dims the control.
const disabled = computed(() => formDisabled.value || props.readonly)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputRating || {}) })({
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  orientation: props.orientation,
  readonly: props.readonly && !formDisabled.value,
  disabled: formDisabled.value
}))

const starIcon = computed(() => props.icon ?? appConfig.ui.icons.star)
const emptyStarIcon = computed(() => props.emptyIcon ?? starIcon.value)

function onUpdate(value: number) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <RatingRoot
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="id"
    v-model="modelValue"
    :name="name"
    :length="props.max"
    :step="props.allowHalf ? 0.5 : 1"
    :disabled="disabled"
    :hoverable="props.hoverable && !disabled"
    :orientation="props.orientation"
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
              data-slot="emptyIcon"
              :class="ui.emptyIcon({ class: props.ui?.emptyIcon })"
            />

            <!-- Indicators overlaid for each step -->
            <RatingItemIndicator
              v-for="step in steps"
              :key="step"
              :step="step"
              :aria-label="`Rate ${step} ${step === 1 ? 'star' : 'stars'} out of ${props.max}`"
              data-slot="indicator"
              :class="ui.indicator({ class: props.ui?.indicator })"
            >
              <UIcon
                :name="starIcon"
                data-slot="icon"
                :class="ui.icon({ class: props.ui?.icon })"
              />
            </RatingItemIndicator>
          </slot>
        </template>
      </RatingItem>
    </template>
  </RatingRoot>
</template>
