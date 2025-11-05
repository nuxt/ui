<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { DateFieldRootProps, DateFieldRootEmits, DateRangeFieldRootProps, DateRangeFieldRootEmits, DateRange } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import type { AppConfig } from '@nuxt/schema'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { ComponentConfig } from '../types/tv'
import theme from '#build/ui/input-date'

type InputDate = ComponentConfig<typeof theme, AppConfig, 'inputDate'>

type InputDateDefaultValue<R extends boolean = false> = R extends true ? DateRange : DateValue
type InputDateModelValue<R extends boolean = false> = R extends true ? (DateRange | null) : (DateValue | undefined)

type _DateFieldRootProps = Omit<DateFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>
type _RangeDateFieldRootProps = Omit<DateRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>

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
}
</script>

<script setup lang="ts" generic="R extends boolean">
import { computed, onMounted, ref } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import { DateField as SingleDateField, DateRangeField as RangeDateField } from 'reka-ui/namespaced'
import { reactiveOmit } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<InputDateProps<R>>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputDateEmits<R>>()
const slots = defineSlots<InputDateSlots>()

const { code: locale, dir } = useLocale()
const appConfig = useAppConfig() as InputDate['AppConfig']

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'range', 'modelValue', 'defaultValue', 'color', 'variant', 'size', 'class', 'ui'), emits)
const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputDateProps<R>>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputDateProps<R>>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputDate || {}) })({
  color: props.color,
  variant: props.variant,
  size: inputSize.value,
  highlight: highlight.value,
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
  <div>
    todo ...
  </div>
</template>
