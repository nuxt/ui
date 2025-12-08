<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { DateFieldRootProps, DateFieldRootEmits, DateRangeFieldRootProps, DateRangeFieldRootEmits, DateValue, SegmentPart } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, IconProps } from '../types'
import type { ComponentConfig } from '../types/tv'
import theme from '#build/ui/input-date'

type InputDate = ComponentConfig<typeof theme, AppConfig, 'inputDate'>

type _DateFieldRootProps = Omit<DateFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>
type _RangeDateFieldRootProps = Omit<DateRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>

type InputDateDefaultValue<R extends boolean = false> = R extends true ? DateRangeFieldRootProps['defaultValue'] : DateFieldRootProps['defaultValue']
type InputDateModelValue<R extends boolean = false> = (R extends true ? DateRangeFieldRootProps['modelValue'] : DateFieldRootProps['modelValue']) | undefined

export interface InputDateProps<R extends boolean = false> extends UseComponentIconsProps, _DateFieldRootProps, _RangeDateFieldRootProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: InputDate['variants']['color']
  /**
   * @defaultValue 'solid'
   */
  variant?: InputDate['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputDate['variants']['size']
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
  /** Whether or not a range of dates can be selected */
  range?: R & boolean
  defaultValue?: InputDateDefaultValue<R>
  modelValue?: InputDateModelValue<R>
  class?: any
  ui?: InputDate['slots']
}

export interface InputDateEmits<R extends boolean> extends Omit<DateFieldRootEmits & DateRangeFieldRootEmits, 'update:modelValue'> {
  'update:modelValue': [date: InputDateModelValue<R>]
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}

export interface InputDateSlots {
  leading(props: { ui: InputDate['ui'] }): any
  default(props: { ui: InputDate['ui'] }): any
  trailing(props: { ui: InputDate['ui'] }): any
  separator(props: { ui: InputDate['ui'] }): any
}
</script>

<script setup lang="ts" generic="R extends boolean">
import { computed, onMounted, ref } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import { DateField as SingleDateField, DateRangeField as RangeDateField } from 'reka-ui/namespaced'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputDateProps<R>>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputDateEmits<R>>()
const slots = defineSlots<InputDateSlots>()

const appConfig = useAppConfig() as InputDate['AppConfig']

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'id', 'name', 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'highlight', 'disabled', 'autofocus', 'autofocusDelay', 'icon', 'avatar', 'leading', 'leadingIcon', 'trailing', 'trailingIcon', 'loading', 'loadingIcon', 'separatorIcon', 'class', 'ui'), emits)
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputDateProps<R>>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputDateProps<R>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const [DefineSegmentsTemplate, ReuseSegmentsTemplate] = createReusableTemplate<{
  segments?: { part: SegmentPart, value: string }[]
  type?: 'start' | 'end'
}>()

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputDate || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  highlight: highlight.value,
  loading: props.loading,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputsRef = ref<ComponentPublicInstance[]>([])

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

const DateField = computed(() => props.range ? RangeDateField : SingleDateField)

defineExpose({
  inputsRef
})
</script>

<template>
  <DefineSegmentsTemplate v-slot="{ segments, type }">
    <DateField.Input
      v-for="(segment, index) in segments"
      :key="`${segment.part}-${index}`"
      :ref="el => (inputsRef[index] = el as ComponentPublicInstance)"
      :type="type"
      :part="segment.part"
      data-slot="segment"
      :class="ui.segment({ class: props.ui?.segment })"
      :data-segment="segment.part"
    >
      {{ segment.value.trim() }}
    </DateField.Input>
  </DefineSegmentsTemplate>

  <DateField.Root
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :id="id"
    v-slot="{ segments }"
    :model-value="(modelValue as DateValue)"
    :default-value="(defaultValue as DateValue)"
    :name="name"
    :disabled="disabled"
    data-slot="base"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <template v-if="Array.isArray(segments)">
      <ReuseSegmentsTemplate :segments="segments" />
    </template>
    <template v-else>
      <ReuseSegmentsTemplate :segments="segments.start" type="start" />
      <slot name="separator" :ui="ui">
        <UIcon :name="separatorIcon || appConfig.ui.icons.minus" data-slot="separatorIcon" :class="ui.separatorIcon({ class: props.ui?.separatorIcon })" />
      </slot>
      <ReuseSegmentsTemplate :segments="segments.end" type="end" />
    </template>

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
  </DateField.Root>
</template>
