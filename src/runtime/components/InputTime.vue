<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { TimeFieldRootProps, TimeFieldRootEmits, TimeRangeFieldRootProps, TimeRangeFieldRootEmits, TimeValue } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/tv'
import type { GetModelValue, GetModelValueEmits } from '../types/utils'
import type { ApplyModifiers, ModelModifiers } from '../types/input'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

export type TimeRangeType = {
  start: TimeValue | undefined
  end: TimeValue | undefined
}

export type InputTimeValue = TimeValue | TimeRangeType

export interface InputTimeProps extends UseComponentIconsProps {
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
  range?: boolean
  /** The value of the input when initially rendered. Use when you do not need to control the state of the input. */
  defaultValue?: TimeValue | TimeRangeType
  /** The controlled value of the input. Can be bind as `v-model`. */
  modelValue?: TimeValue | TimeRangeType | null
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: InputTime['slots']
}

export interface InputTimeEmits extends GetModelValueEmits<InputTimeProps, 'modelValue', false> {
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}

export interface InputTimeSlots {
  leading?(props: { ui: InputTime['ui'] }): VNode[]
  default?(props: { ui: InputTime['ui'] }): VNode[]
  trailing?(props: { ui: InputTime['ui'] }): VNode[]
  'range-seperator'?(): VNode[]
}
</script>

<script setup lang="ts">
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

const props = withDefaults(defineProps<InputTimeProps>(), {
  range: false,
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits>()
const slots = defineSlots<InputTimeSlots>()

const appConfig = useAppConfig() as InputTime['AppConfig']
const uiProp = useComponentUI('inputTime', props)

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'id', 'name', 'color', 'variant', 'size', 'highlight', 'fixed', 'disabled', 'autofocus', 'autofocusDelay', 'icon', 'avatar', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'range', 'class', 'ui'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputTimeProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputTimeProps>(props)
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
  <TimeFieldRoot
    v-if="!range"
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :name="name"
    :disabled="disabled"
    data-slot="base"
    :class="ui.base({ class: [uiProp?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
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
  </TimeFieldRoot>

  <TimeRangeFieldRoot
    v-else
    v-bind="{ ...rootProps, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :name="name"
    :disabled="disabled"
    data-slot="base"
    :class="ui.base({ class: [uiProp?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
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
      <slot name="range-seperator">
        –
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
  </TimeRangeFieldRoot>
</template>
