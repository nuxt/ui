<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/star-rating'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type StarRating = ComponentConfig<typeof theme, AppConfig, 'starRating'>

export interface StarRatingProps {
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
  color?: StarRating['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: StarRating['variants']['size']
  /** Form field name. */
  name?: string
  /** Form field id. */
  id?: string
  /** Form field required. */
  required?: boolean
  class?: any
  ui?: StarRating['slots']
}

export interface StarRatingEmits {
  'update:modelValue': [value: number]
  'change': [event: Event]
}

export interface StarRatingSlots {
  star(props: { index: number, value: number, filled: boolean, half: boolean }): any
}
</script>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { Primitive, useForwardProps } from 'reka-ui'
import { reactivePick, useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<StarRatingProps>(), {
  max: 5,
  allowHalf: false,
  readonly: false,
  defaultValue: 0
})

const emits = defineEmits<StarRatingEmits>()
defineSlots<StarRatingSlots>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: false
})

const appConfig = useAppConfig() as StarRating['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as'))

const { id: _id, emitFormChange, emitFormInput, size, color, name, disabled: formDisabled, ariaAttrs } = useFormField<StarRatingProps>(props)
const fieldId = _id.value ?? useId()

const disabled = computed(() => formDisabled.value || props.disabled || props.readonly)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.starRating || {}) })({
  size: size.value,
  color: color.value,
  readonly: props.readonly,
  disabled: disabled.value
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

const stars = computed(() => {
  return Array.from({ length: props.max }, (_, i) => i + 1)
})

function getStarState(index: number): { filled: boolean, half: boolean } {
  const value = currentValue.value
  const starValue = index

  if (value >= starValue) {
    return { filled: true, half: false }
  }

  if (props.allowHalf && value >= starValue - 0.5) {
    return { filled: false, half: true }
  }

  return { filled: false, half: false }
}

function handleStarClick(event: MouseEvent, index: number) {
  if (disabled.value) return

  let newValue: number

  if (props.allowHalf) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const isHalf = clickX < rect.width / 2
    newValue = isHalf ? index - 0.5 : index
  } else {
    newValue = index
  }

  modelValue.value = newValue

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const changeEvent = new Event('change', { target: { value: newValue } })
  emits('change', changeEvent)
  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <Primitive
    :id="fieldId"
    :name="name"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
  >
    <template v-for="(star, index) in stars" :key="index">
      <slot
        name="star"
        :index="star"
        :value="currentValue"
        :filled="getStarState(star).filled"
        :half="getStarState(star).half"
      >
        <div
          :data-slot="`star-${star}`"
          :class="ui.star({ class: props.ui?.star })"
          @click="(e) => handleStarClick(e, star)"
        >
          <!-- Empty star (background) -->
          <UIcon
            :name="emptyStarIcon"
            :class="ui.star({ class: props.ui?.star })"
            class="text-muted"
          />

          <!-- Filled star (overlay) -->
          <div
            v-if="getStarState(star).filled"
            data-slot="starFilled"
            :class="ui.starFilled({ class: props.ui?.starFilled })"
          >
            <UIcon
              :name="starIcon"
              :class="ui.star({ class: props.ui?.star })"
            />
          </div>

          <!-- Half star (overlay with clip) -->
          <div
            v-else-if="getStarState(star).half"
            data-slot="starHalf"
            :class="ui.starHalf({ class: props.ui?.starHalf })"
            style="clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%); -webkit-clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);"
          >
            <UIcon
              :name="starIcon"
              :class="[ui.star({ class: props.ui?.star }), ui.starHalf({ class: props.ui?.starHalf })]"
            />
          </div>
        </div>
      </slot>
    </template>
  </Primitive>
</template>
