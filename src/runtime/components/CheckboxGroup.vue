<script lang="ts">
import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/checkbox-group'
import type { CheckboxProps } from '../types'
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

export interface CheckboxGroupProps<T extends CheckboxGroupItem = CheckboxGroupItem> extends Pick<CheckboxGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'>, Pick<CheckboxProps, 'color' | 'indicator' | 'icon'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  legend?: string
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
   * @defaultValue 'md'
   */
  size?: CheckboxGroup['variants']['size']
  /**
   * @defaultValue 'list'
   */
  variant?: CheckboxGroup['variants']['variant']
  /**
   * The orientation the checkbox buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: CheckboxGroupRootProps['orientation']
  class?: any
  ui?: CheckboxGroup['slots'] & CheckboxProps['ui']
}

export type CheckboxGroupEmits = CheckboxGroupRootEmits & {
  change: [payload: Event]
}

type SlotProps<T extends CheckboxGroupItem> = (props: { item: T & { id: string } }) => any

export interface CheckboxGroupSlots<T extends CheckboxGroupItem = CheckboxGroupItem> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends CheckboxGroupItem">
import { computed, useId } from 'vue'
import { CheckboxGroupRoot, useForwardProps, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { get, omit } from '../utils'
import { tv } from '../utils/tv'
import UCheckbox from './Checkbox.vue'

const props = withDefaults(defineProps<CheckboxGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})
const emits = defineEmits<CheckboxGroupEmits>()
const slots = defineSlots<CheckboxGroupSlots<T>>()

const appConfig = useAppConfig() as CheckboxGroup['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)
const checkboxProps = useForwardProps(reactivePick(props, 'variant', 'indicator', 'icon'))
const proxySlots = omit(slots, ['legend'])

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<CheckboxGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.checkboxGroup || {}) })({
  size: size.value,
  required: props.required,
  orientation: props.orientation,
  color: props.color,
  variant: props.variant
}))

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
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
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
        v-bind="{ ...item, ...checkboxProps }"
        :color="color"
        :size="size"
        :name="name"
        :disabled="item.disabled || disabled"
        :ui="props.ui ? omit(props.ui, ['root']) : undefined"
        :class="ui.item({ class: props.ui?.item })"
      >
        <template v-for="(_, name) in proxySlots" #[name]>
          <slot :name="(name as keyof CheckboxGroupSlots<T>)" :item="item" />
        </template>
      </UCheckbox>
    </fieldset>
  </CheckboxGroupRoot>
</template>
