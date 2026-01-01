<script lang="ts">
import type { RadioGroupRootProps, RadioGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/radio-group'
import type { AcceptableValue, GetItemKeys, GetModelValue, GetModelValueEmits } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type RadioGroup = ComponentConfig<typeof theme, AppConfig, 'radioGroup'>

export type RadioGroupValue = AcceptableValue

export type RadioGroupItem = RadioGroupValue | {
  label?: string
  description?: string
  disabled?: boolean
  value?: RadioGroupValue
  class?: any
  ui?: Pick<RadioGroup['slots'], 'item' | 'container' | 'base' | 'indicator' | 'wrapper' | 'label' | 'description'>
  [key: string]: any
}

export interface RadioGroupProps<T extends RadioGroupItem[] = RadioGroupItem[], VK extends GetItemKeys<T> = 'value'> extends Pick<RadioGroupRootProps, 'disabled' | 'loop' | 'name' | 'required'> {
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
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  items?: T
  /** The controlled value of the RadioGroup. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, false>
  /** The value of the RadioGroup when initially rendered. Use when you do not need to control the state of the RadioGroup. */
  defaultValue?: GetModelValue<T, VK, false>
  /**
   * @defaultValue 'md'
   */
  size?: RadioGroup['variants']['size']
  /**
   * @defaultValue 'list'
   */
  variant?: RadioGroup['variants']['variant']
  /**
   * @defaultValue 'primary'
   */
  color?: RadioGroup['variants']['color']
  /**
   * The orientation the radio buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: RadioGroupRootProps['orientation']
  /**
   * Position of the indicator.
   * @defaultValue 'start'
   */
  indicator?: RadioGroup['variants']['indicator']
  class?: any
  ui?: RadioGroup['slots']
}

export type RadioGroupEmits<T extends RadioGroupItem[] = RadioGroupItem[], VK extends GetItemKeys<T> = 'value'> = Omit<RadioGroupRootEmits, 'update:modelValue'> & {
  change: [event: Event]
} & GetModelValueEmits<T, VK, false>

type NormalizeItem<T extends RadioGroupItem> = Exclude<T & { id: string }, RadioGroupValue>

type SlotProps<T extends RadioGroupItem> = (props: { item: NormalizeItem<T>, modelValue?: RadioGroupValue }) => any

export interface RadioGroupSlots<T extends RadioGroupItem[] = RadioGroupItem[]> {
  legend(props?: {}): any
  label: SlotProps<T[number]>
  description: SlotProps<T[number]>
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem[], VK extends GetItemKeys<T> = 'value'">
import { computed, useId } from 'vue'
import { RadioGroupRoot, RadioGroupItem as RRadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { get } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<RadioGroupProps<T, VK>>(), {
  valueKey: 'value' as never,
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})
const emits = defineEmits<RadioGroupEmits<T, VK>>()
const slots = defineSlots<RadioGroupSlots<T>>()

const appConfig = useAppConfig() as RadioGroup['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'loop', 'required'), emits)

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<RadioGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.radioGroup || {}) })({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation,
  variant: props.variant,
  indicator: props.indicator
}))

function normalizeItem(item: any) {
  if (item === null) {
    return {
      id: `${id}:null`,
      value: undefined,
      label: undefined
    }
  }

  if (typeof item === 'string' || typeof item === 'number' || typeof item === 'bigint') {
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
    ...(item),
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

<template>
  <RadioGroupRoot
    :id="id"
    v-bind="rootProps"
    :model-value="(modelValue as Exclude<RadioGroupItem, boolean> | Exclude<RadioGroupItem, boolean>[])"
    :default-value="(defaultValue as Exclude<RadioGroupItem, boolean> | Exclude<RadioGroupItem, boolean>[])"
    :orientation="orientation"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <fieldset data-slot="fieldset" :class="ui.fieldset({ class: props.ui?.fieldset })" v-bind="ariaAttrs">
      <legend v-if="legend || !!slots.legend" data-slot="legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>

      <component :is="(!variant || variant === 'list') ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" data-slot="item" :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class], disabled: item.disabled || disabled })">
        <div data-slot="container" :class="ui.container({ class: [props.ui?.container, item.ui?.container] })">
          <RRadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled || disabled"
            data-slot="base"
            :class="ui.base({ class: [props.ui?.base, item.ui?.base], disabled: item.disabled || disabled })"
          >
            <RadioGroupIndicator data-slot="indicator" :class="ui.indicator({ class: [props.ui?.indicator, item.ui?.indicator] })" />
          </RRadioGroupItem>
        </div>

        <div v-if="(item.label || !!slots.label) || (item.description || !!slots.description)" data-slot="wrapper" :class="ui.wrapper({ class: [props.ui?.wrapper, item.ui?.wrapper] })">
          <component :is="(!variant || variant === 'list') ? Label : 'p'" v-if="item.label || !!slots.label" :for="item.id" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label], disabled: item.disabled || disabled })">
            <slot name="label" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" data-slot="description" :class="ui.description({ class: [props.ui?.description, item.ui?.description], disabled: item.disabled || disabled })">
            <slot name="description" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
