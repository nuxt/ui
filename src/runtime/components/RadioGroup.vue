<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { RadioGroupRootProps, RadioGroupRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/radio-group'
import { tv } from '../utils/tv'
import type { AcceptableValue } from '../types/utils'

const appConfigRadioGroup = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfigRadioGroup.ui?.radioGroup || {}) })

type RadioGroupVariants = VariantProps<typeof radioGroup>

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
  size?: RadioGroupVariants['size']
  /**
   * @defaultValue 'primary'
   */
  color?: RadioGroupVariants['color']
  /**
   * The orientation the radio buttons are laid out.
   * @defaultValue 'vertical'
   */
  orientation?: RadioGroupRootProps['orientation']
  class?: any
  ui?: Partial<typeof radioGroup.slots>
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
import { useFormField } from '../composables/useFormField'
import { get } from '../utils'

const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  valueKey: 'value',
  labelKey: 'label',
  descriptionKey: 'description',
  orientation: 'vertical'
})
const emits = defineEmits<RadioGroupEmits>()
const slots = defineSlots<RadioGroupSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'orientation', 'loop', 'required'), emits)

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled, ariaAttrs } = useFormField<RadioGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => radioGroup({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation
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
      <div v-for="item in normalizedItems" :key="item.value" :class="ui.item({ class: props.ui?.item })">
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

        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <Label :class="ui.label({ class: props.ui?.label })" :for="item.id">
            <slot name="label" :item="item" :model-value="(modelValue as RadioGroupValue)">{{ item.label }}</slot>
          </Label>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="(modelValue as RadioGroupValue)">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </div>
    </fieldset>
  </RadioGroupRoot>
</template>
