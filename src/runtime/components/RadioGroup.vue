<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { RadioGroupRootProps, RadioGroupRootEmits, RadioGroupItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/radio-group'
import type { AcceptableValue } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfig.ui?.radioGroup || {}) })

type RadioGroupVariants = VariantProps<typeof radioGroup>

export interface RadioGroupItem extends Pick<RadioGroupItemProps, 'disabled' | 'value'> {
  label?: string
  description?: string
}

export interface RadioGroupProps<T> extends Pick<RadioGroupRootProps, 'defaultValue' | 'disabled' | 'loop' | 'modelValue' | 'name' | 'required'> {
  /**
   * The element or component this component should render as.
   * @defaultValue `div`
   */
  as?: any
  legend?: string
  /**
   * When `items` is an array of objects, select the field to use as the value.
   * @defaultValue 'value'
   */
  valueKey?: string
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

type SlotProps<T> = (props: { item: T, modelValue?: string }) => any

export interface RadioGroupSlots<T> {
  legend(props?: {}): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem | AcceptableValue">
import { computed, useId } from 'vue'
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useFormField } from '../composables/useFormField'

const props = withDefaults(defineProps<RadioGroupProps<T>>(), {
  valueKey: 'value',
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

  const value = item[props.valueKey]

  return {
    ...item,
    value,
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
    data-slot="root"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    @update:model-value="onUpdate"
  >
    <fieldset data-slot="fieldset" :class="ui.fieldset({ class: props.ui?.fieldset })">
      <legend v-if="legend || !!slots.legend" data-slot="legend" :class="ui.legend({ class: props.ui?.legend })">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <div v-for="item in normalizedItems" :key="item.value" data-slot="item" :class="ui.item({ class: props.ui?.item })">
        <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
          <RadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="disabled"
            data-slot="base"
            :class="ui.base({ class: props.ui?.base })"
          >
            <RadioGroupIndicator data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" />
          </RadioGroupItem>
        </div>

        <div data-slot="wrapper" :class="ui.wrapper({ class: props.ui?.wrapper })">
          <Label data-slot="label" :class="ui.label({ class: props.ui?.label })" :for="item.id">
            <slot name="label" :item="item" :model-value="modelValue">{{ item.label }}</slot>
          </Label>
          <p v-if="item.description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description" :item="item" :model-value="modelValue">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </div>
    </fieldset>
  </RadioGroupRoot>
</template>
