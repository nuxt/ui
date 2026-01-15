<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { TimeFieldRootProps, TimeFieldRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'
import { Time } from '@internationalized/date'

type SegmentPart = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'dayPeriod' | 'literal' | 'timeZoneName'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

type _TimeFieldRootProps = Omit<TimeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>

type TimeValue = TimeFieldRootProps['modelValue']

interface TimeRange {
  start: TimeValue | undefined
  end: TimeValue | undefined
}

export type { TimeRange }

type InputTimeDefaultValue<R extends boolean = false> = R extends true ? TimeRange : TimeFieldRootProps['defaultValue']
type InputTimeModelValue<R extends boolean = false> = (R extends true ? TimeRange : TimeFieldRootProps['modelValue']) | undefined

export interface InputTimeProps<R extends boolean = false> extends UseComponentIconsProps, _TimeFieldRootProps {
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
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon to use as a range separator.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  separatorIcon?: IconProps['name']
  /** Whether or not a range of times can be selected */
  range?: R & boolean
  defaultValue?: InputTimeDefaultValue<R>
  modelValue?: InputTimeModelValue<R>
  class?: any
  ui?: InputTime['slots']
}

export interface InputTimeEmits<R extends boolean> extends Omit<TimeFieldRootEmits, 'update:modelValue'> {
  'update:modelValue': [date: InputTimeModelValue<R>]
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}

export interface InputTimeSlots {
  leading(props: { ui: InputTime['ui'] }): any
  default(props: { ui: InputTime['ui'] }): any
  trailing(props: { ui: InputTime['ui'] }): any
  separator(props: { ui: InputTime['ui'] }): any
}
</script>

<script setup lang="ts" generic="R extends boolean">
import { computed, onMounted, ref } from 'vue'
import { TimeFieldRoot, TimeFieldInput, useForwardPropsEmits } from 'reka-ui'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputTimeProps<R>>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits<R>>()
const slots = defineSlots<InputTimeSlots>()

const appConfig = useAppConfig() as InputTime['AppConfig']

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'id', 'name', 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'highlight', 'disabled', 'autofocus', 'autofocusDelay', 'icon', 'avatar', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'separatorIcon', 'class', 'ui'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputTimeProps<R>>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputTimeProps<R>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const [DefineSegmentsTemplate, ReuseSegmentsTemplate] = createReusableTemplate<{
  segments?: { part: SegmentPart, value: string }[]
}>()

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTime || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputsRef = ref<ComponentPublicInstance[]>([])

// Range mode: internal state for start/end
const startValue = computed(() => {
  if (props.range && props.modelValue) {
    return (props.modelValue as TimeRange).start ?? new Time(0, 0)
  }
  return undefined
})

const endValue = computed(() => {
  if (props.range && props.modelValue) {
    return (props.modelValue as TimeRange).end ?? new Time(0, 0)
  }
  return undefined
})

const startDefaultValue = computed(() => {
  if (props.range && props.defaultValue) {
    return (props.defaultValue as TimeRange).start ?? new Time(0, 0)
  }
  return undefined
})

const endDefaultValue = computed(() => {
  if (props.range && props.defaultValue) {
    return (props.defaultValue as TimeRange).end ?? new Time(0, 0)
  }
  return undefined
})

function onUpdateStart(value: TimeValue | undefined) {
  if (props.range) {
    const newRange = { start: value, end: endValue.value } as InputTimeModelValue<R>
    emits('update:modelValue', newRange)
    triggerChange(newRange)
  }
}

function onUpdateEnd(value: TimeValue | undefined) {
  if (props.range) {
    const newRange = { start: startValue.value, end: value } as InputTimeModelValue<R>
    emits('update:modelValue', newRange)
    triggerChange(newRange)
  }
}

function triggerChange(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)

  emitFormChange()
  emitFormInput()
}

function onUpdate(value: any) {
  triggerChange(value)
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
  <DefineSegmentsTemplate v-slot="{ segments }">
    <TimeFieldInput
      v-for="(segment, index) in segments"
      :key="`${segment.part}-${index}`"
      :ref="(el) => (inputsRef[index] = el as ComponentPublicInstance)"
      :part="segment.part"
      data-slot="segment"
      :class="ui.segment({ class: props.ui?.segment })"
      :data-segment="segment.part"
    >
      {{ segment.value.trim() }}
    </TimeFieldInput>
  </DefineSegmentsTemplate>

  <!-- Range mode: two TimeFieldRoot side by side -->
  <template v-if="range">
    <div
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :id="id"
      data-slot="base"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    >
      <TimeFieldRoot
        v-slot="{ segments }"
        v-bind="rootProps"
        class="flex"
        :model-value="startValue"
        :default-value="startDefaultValue"
        :name="name ? `${name}[start]` : undefined"
        :disabled="disabled"
        @update:model-value="onUpdateStart"
        @blur="onBlur"
        @focus="onFocus"
      >
        <ReuseSegmentsTemplate :segments="segments" />
      </TimeFieldRoot>

      <slot name="separator" :ui="ui">
        <UIcon :name="separatorIcon || appConfig.ui.icons.minus" data-slot="separatorIcon" :class="ui.separatorIcon({ class: props.ui?.separatorIcon })" />
      </slot>

      <TimeFieldRoot
        v-slot="{ segments }"
        v-bind="rootProps"
        class="flex"
        :model-value="endValue"
        :default-value="endDefaultValue"
        :name="name ? `${name}[end]` : undefined"
        :disabled="disabled"
        @update:model-value="onUpdateEnd"
        @blur="onBlur"
        @focus="onFocus"
      >
        <ReuseSegmentsTemplate :segments="segments" />
      </TimeFieldRoot>

      <slot :ui="ui" />

      <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
        </slot>
      </span>

      <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :ui="ui">
          <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </div>
  </template>

  <!-- Single mode -->
  <TimeFieldRoot
    v-else
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :name="name"
    :disabled="disabled"
    data-slot="base"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <ReuseSegmentsTemplate :segments="segments" />

    <slot :ui="ui" />

    <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </TimeFieldRoot>
</template>
