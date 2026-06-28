<script lang="ts">
import type { VNode } from 'vue'
import type { RatingRootProps, RatingRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-rating'
import type { IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputRating = ComponentConfig<typeof theme, AppConfig, 'inputRating'>

export interface InputRatingProps extends Pick<RatingRootProps, 'length' | 'step' | 'name' | 'disabled' | 'required' | 'clearable' | 'hoverable' | 'modelValue' | 'defaultValue'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The id of the rating. */
  id?: string
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

export interface InputRatingEmits extends RatingRootEmits {
  change: [event: Event]
}

export interface InputRatingSlots {
  /** Rendered for each item. `filled` is `false` for the empty background layer and `true` for the highlighted overlay. */
  item?(props: { index: number, filled: boolean }): VNode[]
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
  length: 5,
  step: 1,
  readonly: false,
  defaultValue: 0,
  orientation: 'horizontal',
  hoverable: false,
  clearable: false
})
const emits = defineEmits<InputRatingEmits>()
defineSlots<InputRatingSlots>()

const props = useComponentProps<InputRatingProps>('inputRating', _props)

const appConfig = useAppConfig() as InputRating['AppConfig']

const rootProps = useForwardProps(reactivePick(props, 'as', 'length', 'step', 'hoverable', 'clearable', 'required', 'modelValue', 'defaultValue'), emits)

const { id, emitFormChange, emitFormInput, size, color, name, disabled: formDisabled, ariaAttrs } = useFormField<InputRatingProps>(_props)

// `readonly` blocks interaction too, but only an explicit `disabled` dims the control.
const disabled = computed(() => formDisabled.value || props.readonly)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.inputRating || {}) })({
  size: size.value ?? props.size,
  color: color.value ?? props.color,
  orientation: props.orientation,
  readonly: props.readonly && !formDisabled.value,
  disabled: formDisabled.value
}))

const starIcon = computed(() => props.icon ?? appConfig.ui.icons.star)

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
    v-slot="{ items }"
    :name="name"
    :disabled="disabled"
    :aria-readonly="props.readonly || undefined"
    :orientation="props.orientation"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <RatingItem
      v-for="item in items"
      v-slot="{ steps }"
      :key="item"
      :item="item"
      data-slot="item"
      :class="ui.item({ class: props.ui?.item })"
    >
      <!-- Empty icon as background -->
      <slot name="item" :index="item" :filled="false">
        <UIcon
          :name="props.emptyIcon ?? starIcon"
          data-slot="emptyIcon"
          :class="ui.emptyIcon({ class: props.ui?.emptyIcon })"
        />
      </slot>

      <!-- Indicators overlaid for each step, clipped to the rated fraction -->
      <RatingItemIndicator
        v-for="step in steps"
        :key="step"
        :step="step"
        :aria-label="`Rate ${step} out of ${props.length}`"
        data-slot="indicator"
        :class="ui.indicator({ class: props.ui?.indicator })"
      >
        <slot name="item" :index="item" :filled="true">
          <UIcon
            :name="starIcon"
            data-slot="icon"
            :class="ui.icon({ class: props.ui?.icon })"
          />
        </slot>
      </RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
