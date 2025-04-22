<script lang="ts">
import type { RadioGroupRootProps, RadioGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/radio-group'
import type { AcceptableValue, ComponentConfig } from '../types/utils'

type RadioGroup = ComponentConfig<typeof theme, AppConfig, 'radioGroup'>

export type RadioGroupValue = AcceptableValue
export type RadioGroupItem = {
  label?: string
  description?: string
  disabled?: boolean
  value?: string
  [key: string]: any
} | RadioGroupValue

export interface RadioGroupProps<T extends RadioGroupItem = RadioGroupItem> extends Pick<RadioGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
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

export type RadioGroupEmits = RadioGroupRootEmits & {
  change: [payload: Event]
}

type SlotProps<T extends RadioGroupItem> = (props: { item: T & { id: string }, modelValue?: RadioGroupValue }) => any

export interface RadioGroupSlots<T extends RadioGroupItem = RadioGroupItem> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem">
import { computed, useId } from 'vue'
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { get } from '../utils'
import { tv } from '../utils/tv'

const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})
const emits = defineEmits<RadioGroupEmits>()
const slots = defineSlots<RadioGroupSlots<T>>()

const appConfig = useAppConfig() as RadioGroup['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)

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

<template>
  <RadioGroupRoot
    :id="id"
    v-slot="{ modelValue }"
    v-bind="rootProps"
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

      <component :is="variant === 'list' ? 'div' : Label" v-for="item in normalizedItems" :key="item.value" :class="ui.item({ class: props.ui?.item })">
        <div :class="ui.container({ class: props.ui?.container })">
          <RadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="item.disabled"
            :class="ui.base({ class: props.ui?.base, disabled: item.disabled })"
          >
            <RadioGroupIndicator :class="ui.indicator({ class: props.ui?.indicator })" />
          </RadioGroupItem>
        </div>

        <div v-if="(item.label || !!slots.label) || (item.description || !!slots.description)" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <component :is="variant === 'list' ? Label : 'p'" v-if="item.label || !!slots.label" :for="item.id" :class="ui.label({ class: props.ui?.label })">
            <slot name="label" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.label }}
            </slot>
          </component>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </component>
    </fieldset>
  </RadioGroupRoot>
</template>
