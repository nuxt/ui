<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { RadioGroupRootProps, RadioGroupRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/radio-group'

const appConfig = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfig.ui?.radioGroup || {}) })

type RadioGroupVariants = VariantProps<typeof radioGroup>

export type RadioGroupItem = {
  label: string
  value: string
  description?: string
}

export interface RadioGroupProps<T> extends Omit<RadioGroupRootProps, 'asChild' | 'dir'> {
  legend?: string
  items?: T[]
  class?: any
  size?: RadioGroupVariants['size']
  color?: RadioGroupVariants['color']
  ui?: Partial<typeof radioGroup.slots>
}

export type RadioGroupEmits = {
  change: [value: any]
} & RadioGroupRootEmits

type SlotProps<T> = (props: { item: T }) => any

export interface RadioGroupSlots<T> {
  legend(): any
  label: SlotProps<T>
  description: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends RadioGroupItem | string">
import { computed } from 'vue'
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId, useFormField } from '#imports'

const props = withDefaults(defineProps<RadioGroupProps<T>>(), { orientation: 'vertical' })
const emits = defineEmits<RadioGroupEmits>()
const slots = defineSlots<RadioGroupSlots<T>>()

const modelValue = defineModel<string>({
  set(value) {
    emits('change', value)
    return value
  }
})

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultValue', 'orientation', 'loop', 'required'), emits)

const { emitFormChange, color, name, size, id: _id, disabled } = useFormField<RadioGroupProps<T>>(props)
const id = _id.value ?? useId()

const ui = computed(() => tv({ extend: radioGroup, slots: props.ui })({
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

  return {
    ...item,
    id: `${id}:${item.value}`
  }
}

const normalizedItems = computed(() => {
  if (!props.items) return []
  return props.items.map(normalizeItem)
})

// FIXME: I think there's a race condition between this and the v-model event.
// This must be triggered after the value updates, otherwise the form validates
// the previous value.
function onUpdate() {
  emitFormChange()
}
</script>

<template>
  <RadioGroupRoot
    :id="id"
    v-model="modelValue"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: props.class })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset()">
      <legend v-if="legend || !!slots.legend" :class="ui.legend()">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <div v-for="item in normalizedItems" :key="item.value" :class="ui.item()">
        <div :class="ui.container()">
          <RadioGroupItem
            :id="item.id"
            :value="item.value"
            :disabled="disabled"
            :class="ui.base()"
          >
            <RadioGroupIndicator :class="ui.indicator()" />
          </RadioGroupItem>
        </div>

        <div :class="ui.wrapper()">
          <Label :class="ui.label()" :for="item.id">
            <slot name="label" :item="item">{{ item.label }}</slot>
          </Label>
          <p v-if="item.description || !!slots.description" :class="ui.description()">
            <slot name="description" :item="item">
              {{ item.description }}
            </slot>
          </p>
        </div>
      </div>
    </fieldset>
  </RadioGroupRoot>
</template>
