<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { RadioGroupRootProps, RadioGroupRootEmits, AcceptableValue } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/radio-group'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'

const appConfig = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfig.ui?.radioGroup || {}) })

type RadioGroupVariants = VariantProps<typeof radioGroup>

export interface RadioGroupItem {
  label?: string
  description?: string
  disabled?: boolean
  value?: string
}

export interface RadioGroupProps<T> extends Pick<RadioGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
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
  size?: RadioGroupVariants['size']
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

type SlotProps<T> = (props: { item: T, modelValue?: AcceptableValue }) => any

export interface RadioGroupSlots<T> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}

extendDevtoolsMeta({ defaultProps: { items: ['Option 1', 'Option 2', 'Option 3'] } })
</script>

<script setup lang="ts" generic="T extends RadioGroupItem | AcceptableValue">
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

const { emitFormChange, emitFormInput, color, name, size, id: _id, disabled } = useFormField<RadioGroupProps<T>>(props, { bind: false })
const id = _id.value ?? useId()

const ui = computed(() => radioGroup({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required,
  orientation: props.orientation
}))

function normalizeItem(item: any) {
  if (['string', 'number', 'boolean'].includes(typeof item)) {
    return {
      id: `${id}:${item}`,
      value: item,
      label: item
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
    <fieldset :class="ui.fieldset({ class: props.ui?.fieldset })">
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
            :disabled="disabled"
            :class="ui.base({ class: props.ui?.base })"
          >
            <RadioGroupIndicator :class="ui.indicator({ class: props.ui?.indicator })" />
          </RadioGroupItem>
        </div>

        <div :class="ui.wrapper({ class: props.ui?.wrapper })">
          <Label :class="ui.label({ class: props.ui?.label })" :for="item.id">
            <slot name="label" :item="item" :model-value="modelValue">{{ item.label }}</slot>
          </Label>
          <p v-if="item.description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="modelValue">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </div>
    </fieldset>
  </RadioGroupRoot>
</template>
