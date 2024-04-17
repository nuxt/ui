<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { RadioGroupRootProps, RadioGroupRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/radio-group'

const appConfig = _appConfig as AppConfig & { ui: { radioGroup: Partial<typeof theme> } }

const radioGroup = tv({ extend: tv(theme), ...(appConfig.ui?.radioGroup || {}) })

type RadioGroupVariants = VariantProps<typeof radioGroup>

export type RadioGroupOption<T> = {
  label: string
  value: T
  description?: string
}

export interface RadioGroupProps<T> extends Omit<RadioGroupRootProps, 'asChild' | 'dir'> {
  legend?: string
  options?: string[] | RadioGroupOption<T>[]
  class?: any
  size?: RadioGroupVariants['size']
  color?: RadioGroupVariants['color']
  ui?: Partial<typeof radioGroup.slots>
}

export type RadioGroupEmits = {
  change: [value: any]
} & RadioGroupRootEmits

export interface RadioGroupSlots<T> {
  legend(): any
  label(props: { option: RadioGroupOption<T> }): any
  description(props: { option: RadioGroupOption<T> }): any
}
</script>

<script setup lang="ts" generic="T extends string | undefined">
import { computed } from 'vue'
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator, Label, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useId, useFormField } from '#imports'

const props = defineProps<RadioGroupProps<T>>()
const emits = defineEmits<RadioGroupEmits>()
defineSlots<RadioGroupSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'defaultValue', 'orientation', 'loop', 'required'), emits)

const { emitFormChange, color, name, size, inputId: _inputId, disabled } = useFormField<RadioGroupProps<T>>(props)
const inputId = _inputId.value ?? useId()

const ui = computed(() => tv({ extend: radioGroup, slots: props.ui })({
  size: size.value,
  color: color.value,
  disabled: disabled.value,
  required: props.required
}))

function normalizeOption(option: any) {
  if (['string', 'number', 'boolean'].includes(typeof option)) {
    return {
      id: `${inputId}:${option}`,
      value: option,
      label: option
    }
  }

  return {
    ...option,
    id: `${inputId}:${option.value}`
  }
}

const normalizedOptions = computed(() => {
  if (!props.options) return []
  return props.options.map(normalizeOption)
})

const modelValue = defineModel<T>({
  set(value) {
    emits('change', value)
    return value
  }
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
    :id="inputId"
    v-model="modelValue"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    :class="ui.root({ class: props.class })"
    @update:model-value="onUpdate"
  >
    <fieldset :class="ui.fieldset()">
      <legend v-if="legend || $slots.legend" :class="ui.legend()">
        <slot name="legend">
          {{ legend }}
        </slot>
      </legend>
      <div v-for="option in normalizedOptions" :key="option.value" :class="ui.option()">
        <div :class="ui.container()">
          <RadioGroupItem
            :id="option.id"
            :value="option.value"
            :disabled="disabled"
            :class="ui.base()"
          >
            <RadioGroupIndicator :class="ui.indicator()" />
          </RadioGroupItem>
        </div>

        <div :class="ui.wrapper()">
          <Label :class="ui.label()" :for="option.id">
            <slot name="label" v-bind="{ option }">{{ option.label }}</slot>
          </Label>
          <p v-if="option.description || $slots.description" :class="ui.description()">
            <slot name="description" v-bind="{ option }">
              {{ option.description }}
            </slot>
          </p>
        </div>
      </div>
    </fieldset>
  </RadioGroupRoot>
</template>
