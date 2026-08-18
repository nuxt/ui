<script lang="ts">
import type { ComponentPublicInstance, VNode } from 'vue'
import type { TimeFieldRootEmits, TimeFieldRootProps, TimeRangeFieldRootEmits, TimeRangeFieldRootProps, TimeValue, SegmentPart } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-time'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from './Avatar.vue'
import type { IconProps } from './Icon.vue'
import type { ComponentConfig } from '../types/tv'

type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>

type InputTimeDefaultValue<R extends boolean = false> = R extends true
  ? TimeRangeFieldRootProps['defaultValue']
  : TimeFieldRootProps['defaultValue']

type InputTimeModelValue<R extends boolean = false> = (R extends true
  ? TimeRangeFieldRootProps['modelValue']
  : TimeFieldRootProps['modelValue']) | undefined

type _TimeFieldRootProps = Omit<TimeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir'>
type _TimeRangeFieldRootProps = Omit<TimeRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir'>

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
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon to use as a range separator.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  separatorIcon?: IconProps['name']
  /**
   * Enable time range selection.
   * @defaultValue false
   */
  range?: R & boolean
  /** The value of the input when initially rendered. Use when you do not need to control the state of the input. */
  defaultValue?: InputTimeDefaultValue<R>
  /** The controlled value of the input. Can be bind as `v-model`. */
  modelValue?: InputTimeModelValue<R>
  class?: any
  ui?: InputTime['slots']
}

export interface InputTimeEmits<R extends boolean = false> extends Omit<TimeFieldRootEmits & TimeRangeFieldRootEmits, 'update:modelValue'> {
  'update:modelValue': [value: InputTimeModelValue<R>]
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}

export interface InputTimeSlots {
  leading?(props: { ui: InputTime['ui'] }): VNode[]
  default?(props: { ui: InputTime['ui'] }): VNode[]
  trailing?(props: { ui: InputTime['ui'] }): VNode[]
  separator?(props: { ui: InputTime['ui'] }): VNode[]
}
</script>

<script setup lang="ts" generic="R extends boolean">
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { TimeRangeFieldRoot, TimeRangeFieldInput } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { TimeField as SingleTimeField } from 'reka-ui/namespaced'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<InputTimeProps<R>>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputTimeEmits<R>>()
const slots = defineSlots<InputTimeSlots>()

const props = useComponentProps<InputTimeProps<R>>('inputTime', _props)

const appConfig = useAppConfig() as InputTime['AppConfig']

const rootProps = useForwardProps(reactiveOmit(props, 'id', 'name', 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'highlight', 'fixed', 'disabled', 'autofocus', 'autofocusDelay', 'icon', 'avatar', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'separatorIcon', 'class', 'ui'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color: formFieldColor, size: formFieldSize, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField<InputTimeProps<R>>(_props)

const { orientation, size: fieldGroupSize } = useFieldGroup<InputTimeProps<R>>(_props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color)
// eslint-disable-next-line vue/no-dupe-keys
const highlight = computed(() => formFieldHighlight.value ?? props.highlight)
// eslint-disable-next-line vue/no-dupe-keys
const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size)

const disabled = computed(() => formFieldDisabled.value ?? props.disabled)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.inputTime || {}) })({
  color: color.value,
  variant: props.variant,
  size: size.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const [DefineSegmentsTemplate, ReuseSegmentsTemplate] = createReusableTemplate<{
  segments?: { part: SegmentPart, value: string }[]
  type?: 'start' | 'end'
}>()

const inputsRef = ref<ComponentPublicInstance[]>([])

// FIXME: Move to namespaced when exported in `reka-ui`
const RangeTimeField = { Root: TimeRangeFieldRoot, Input: TimeRangeFieldInput }

const TimeField = computed(() => props.range ? RangeTimeField : SingleTimeField)

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

function onFocusOut(event: FocusEvent) {
  if (event.relatedTarget && (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
    return
  }

  emitFormBlur()
  emits('blur', event)
}

function onFocusIn(event: FocusEvent) {
  if (event.relatedTarget && (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
    return
  }

  emitFormFocus()
  emits('focus', event)
}

function autoFocus() {
  if (props.autofocus) {
    inputsRef.value[0]?.$el?.focus()
  }
}

let autofocusTimeoutId: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  autofocusTimeoutId = setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

onScopeDispose(() => clearTimeout(autofocusTimeoutId))

defineExpose({
  inputsRef
})
</script>

<template>
  <DefineSegmentsTemplate v-slot="{ segments, type }">
    <TimeField.Input
      v-for="(segment, index) in segments"
      :key="`${segment.part}-${index}`"
      :ref="el => setInputRef(index, el)"
      :type="type"
      :part="segment.part"
      data-slot="segment"
      :class="ui.segment({ class: props.ui?.segment })"
      :data-segment="segment.part"
    >
      {{ segment.value.trim() }}
    </TimeField.Input>
  </DefineSegmentsTemplate>

  <TimeField.Root
    :id="id"
    v-slot="{ segments }"
    data-slot="base"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :name="name"
    :disabled="disabled"
    :model-value="(props.modelValue as TimeValue)"
    :default-value="(props.defaultValue as TimeValue)"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @focusout="onFocusOut"
    @focusin="onFocusIn"
  >
    <template v-if="Array.isArray(segments)">
      <ReuseSegmentsTemplate :segments="segments" />
    </template>
    <template v-else>
      <ReuseSegmentsTemplate :segments="segments.start" type="start" />
      <slot name="separator" :ui="ui">
        <UIcon :name="props.separatorIcon || appConfig.ui.icons.minus" data-slot="separatorIcon" :class="ui.separatorIcon({ class: props.ui?.separatorIcon })" />
      </slot>
      <ReuseSegmentsTemplate :segments="segments.end" type="end" />
    </template>

    <slot :ui="ui" />

    <span v-if="isLeading || !!props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!props.avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="props.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </TimeField.Root>
</template>
