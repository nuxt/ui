<script lang="ts">
import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox-group'
import type { AcceptableValue, ComponentConfig } from '../types/utils'

type CheckboxGroup = ComponentConfig<typeof theme, AppConfig, 'checkboxGroup'>

export type CheckboxGroupValue = AcceptableValue

export type CheckboxGroupItem = {
  label?: string
  description?: string
  disabled?: boolean
  value?: string
  [key: string]: any
} | CheckboxGroupValue

export interface CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> extends Pick<CheckboxGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  legend?: string // should be legend
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: string
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: string
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: string
  items?: T[]
  /**
   * @defaultValue 'primary'
   */
  color?: CheckboxGroup['variants']['color']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: CheckboxGroup['variants']['indicator']
  /**
   * The orientation the checkbox buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: CheckboxGroupRootProps['orientation']
  /**
   * @defaultValue 'md'
   */
  size?: CheckboxGroup['variants']['size']
  /**
   * @defaultValue 'list'
   */
  variant?: CheckboxGroup['variants']['variant']
  /**
   * The icon displayed when checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  icon?: string
  /**
   * The icon displayed when the checkbox is indeterminate.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  indeterminateIcon?: string
  class?: any
  ui?: CheckboxGroup['slots']
}

export type CheckboxGroupEmits = CheckboxGroupRootEmits & {
  change: [payload: Event]
}

type SlotProps<T extends CheckboxGroupItem> = (props: { item: T & { id: string }, modelValue?: CheckboxGroupValue }) => any

export interface CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends CheckboxGroupItem">
import { computed, useId, provide } from 'vue'
import { CheckboxGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { checkboxGroupInjectionKey } from '../composables/useCheckboxGroup'
import { get } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})

const emits = defineEmits<CheckboxGroupEmits>()
const slots = defineSlots<CheckboxGroupSlots<T>>()

const modelValue = defineModel<string[]>({ default: undefined })

const appConfig = useAppConfig() as CheckboxGroup['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<CheckboxGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.checkboxGroup || {}) })({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}))

provide(checkboxGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size,
  variant: props.variant,
  indicator: props.indicator
})))

function normalizeItem(item: any) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: undefined,
      label: undefined
    }
  }

  if (typeof item === 'string' || typeof item === 'number') {
    return {
      id: `${id}:${item}`,
      value: String(item),
      label: String(item)
    }
  }

  const value = get(item, props.valueKey as string)
  const label = get(item, props.labelKey as string)
  const description = get(item, props.descriptionKey as string)

  return {
    ...item,
    value,
    label,
    description,
    id: `${id}:${value}`
  }
}

const normalizedItems = computed(() => {
  if (!props.items) {
    return []
  }
  return props.items.map(normalizeItem)
})

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <CheckboxGroupRoot
    :id="id"
    v-bind="rootProps"
    v-model="modelValue"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <UCheckbox
        v-for="item in normalizedItems"
        :key="item.value"
        v-bind="item"
        :color="color"
        :icon="icon"
        :indeterminate-icon="indeterminateIcon"
        :name="name"
        :disabled="item.disabled || disabled"
        :default-value="item.value === 'indeterminate' ? 'indeterminate' : defaultValue?.includes(item.value)"
        :model-value="item.value === 'indeterminate' ? 'indeterminate' : modelValue?.includes(item.value)"
      />
    </fieldset>
  </CheckboxGroupRoot>
</template>
