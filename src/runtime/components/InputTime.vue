<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { TimeFieldRootEmits, TimeFieldRootProps, TimeRangeFieldRootEmits, TimeRangeFieldRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

type InputTimeDefaultValue<R extends boolean = false> = R extends true
  ? TimeRangeFieldRootProps['defaultValue']
  : TimeFieldRootProps['defaultValue']

type InputTimeModelValue<R extends boolean = false> = (R extends true
  ? TimeRangeFieldRootProps['modelValue']
  : TimeFieldRootProps['modelValue']) | undefined

// Omit des props comme dans Calendar.vue / InputDate.vue
type _TimeFieldRootProps = Omit<TimeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>
type _TimeRangeFieldRootProps = Omit<TimeRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>

export interface InputTimeProps<R extends boolean = false> extends UseComponentIconsProps, _TimeFieldRootProps, _TimeRangeFieldRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: InputTime['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: InputTime['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputTime['variants']['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /** Keep the mobile text size on all breakpoints. */
  fixed?: boolean
  /**
   * Enable time range selection.
   * @defaultValue false
   */
  range?: R & boolean
  separatorIcon?: IconProps['name']
  /** The value of the input when initially rendered. Use when you do not need to control the state of the input. */
  defaultValue?: InputTimeDefaultValue<R>
  /** The controlled value of the input. Can be bind as `v-model`. */
  modelValue?: InputTimeModelValue<R>
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: InputTime['slots']
}

export interface InputTimeEmits<R extends boolean = false> extends Omit<TimeFieldRootEmits & TimeRangeFieldRootEmits, 'update:modelValue'> {
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'update:modelValue': [value: InputTimeModelValue<R>]
}

export interface InputTimeSlots {
  leading?(props: { ui: InputTime['ui'] }): VNode[]
  default?(props: { ui: InputTime['ui'] }): VNode[]
  trailing?(props: { ui: InputTime['ui'] }): VNode[]
  separator?(props: { ui: InputTime['ui'] }): VNode[]
}
</script>

<script setup lang="ts" generic="R extends boolean">
import { computed, onMounted, ref } from 'vue'
import { TimeFieldRoot, TimeFieldInput, TimeRangeFieldRoot, TimeRangeFieldInput, useForwardPropsEmits } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<InputTimeProps<R>>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits<R>>()
const slots = defineSlots<InputTimeSlots>()

const appConfig = useAppConfig() as InputTime['AppConfig']
const uiProp = useComponentUI('inputTime', props)

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'id', 'name', 'color', 'variant', 'size', 'highlight', 'fixed', 'disabled', 'autofocus', 'autofocusDelay', 'icon', 'avatar', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'range', 'class', 'ui', 'modelValue', 'defaultValue'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputTimeProps<R>>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputTimeProps<R>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTime || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputsRef = ref<ComponentPublicInstance[]>([])

const FieldRoot = computed(() => props.range ? TimeRangeFieldRoot : TimeFieldRoot)
const rootModelValue = computed(() => props.range
  ? props.modelValue
  : props.modelValue)
const rootDefaultValue = computed(() => props.range
  ? props.defaultValue
  : props.defaultValue)

function setInputRef(index: number, el: Element | ComponentPublicInstance | null) {
  // @ts-expect-error - ComponentPublicInstance type mismatch in Nuxt module augmentation
  inputsRef.value[index] = el
}

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)

  emitFormChange()
  emitFormInput()
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function onFocus(event: FocusEvent) {
  emitFormFocus()
  emits('focus', event)
}

function autoFocus() {
  if (props.autofocus) {
    inputsRef.value[0]?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputsRef
})
</script>

<template>
  <component
    :is="FieldRoot"
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :name="name"
    :disabled="disabled"
    :model-value="rootModelValue as (R extends false ? TimeFieldRootProps['modelValue'] : TimeFieldRootProps['modelValue'])"
    :default-value="rootDefaultValue as (R extends false ? TimeFieldRootProps['defaultValue'] : TimeFieldRootProps['defaultValue'])"
    data-slot="base"
    :class="ui.base({ class: [uiProp?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <template v-if="Array.isArray(segments)">
      <TimeFieldInput
        v-for="(segment, index) in segments"
        :key="`${segment.part}-${index}`"
        :ref="el => setInputRef(index, el)"
        :part="segment.part"
        data-slot="segment"
        :class="ui.segment({ class: uiProp?.segment })"
      >
        {{ segment.value.trim() }}
      </TimeFieldInput>
    </template>

    <template v-else>
      <TimeRangeFieldInput
        v-for="(segment, index) in segments.start"
        :key="`start-${segment.part}-${index}`"
        :ref="el => setInputRef(index, el)"
        :part="segment.part"
        type="start"
        data-slot="segment"
        :class="ui.segment({ class: uiProp?.segment })"
      >
        {{ segment.value.trim() }}
      </TimeRangeFieldInput>

      <span data-slot="range-separator" :class="ui.rangeSeparator({ class: uiProp?.rangeSeparator })">
        <slot name="separator" :ui="ui">
          <UIcon :name="separatorIcon || appConfig.ui.icons.minus" data-slot="separatorIcon" :class="ui.separatorIcon({ class: uiProp?.separatorIcon })" />
        </slot>
      </span>

      <TimeRangeFieldInput
        v-for="(segment, index) in segments.end"
        :key="`end-${segment.part}-${index}`"
        :ref="el => setInputRef(segments.start.length + 1 + index, el)"
        :part="segment.part"
        type="end"
        data-slot="segment"
        :class="ui.segment({ class: uiProp?.segment })"
      >
        {{ segment.value.trim() }}
      </TimeRangeFieldInput>
    </template>

    <slot :ui="ui" />

    <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="((uiProp?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: uiProp?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
      </slot>
    </span>
  </component>
</template>
