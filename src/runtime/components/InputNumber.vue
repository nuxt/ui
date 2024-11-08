<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { NumberFieldRootProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input-number'

const appConfig = _appConfig as AppConfig & { ui: { inputNumber: Partial<typeof theme> } }

const inputNumber = tv({ extend: tv(theme), ...(appConfig.ui?.inputNumber || {}) })

type InputNumberVariants = VariantProps<typeof inputNumber>

export interface InputNumberProps extends NumberFieldRootProps {
  class?: any
  placeholder?: string
  ui?: Partial<typeof inputNumber.slots>
  color?: InputNumberVariants['color']
  variant?: InputNumberVariants['variant']
  size?: InputNumberVariants['size']
}

export interface InputNumberEmits {
  (e: 'update:modelValue', payload: number): void
  (e: 'change', payload: Event): void
}

export interface InputNumberSlots {}
</script>

<script setup lang="ts">
import {
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
  useForwardPropsEmits
} from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { useFormField } from '../composables/useFormField'

defineOptions({ inheritAttrs: false })

const props = defineProps<InputNumberProps>()
const emits = defineEmits<InputNumberEmits>()
const _slots = defineSlots<InputNumberSlots>()

const modelValue = defineModel<number>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const { emitFormChange, emitFormInput, id, color, size, name, disabled } = useFormField<InputNumberProps>(props)

const ui = computed(() => inputNumber({
  color: color.value,
  variant: props.variant,
  size: size.value
}))

function onInput(value: number) {
  modelValue.value = value

  emitFormChange()
  emitFormInput()
}
</script>

<template>
  <NumberFieldRoot
    v-bind="rootProps"
    :id="id"
    v-model="modelValue"
    :class="ui.root({ class: [props.class, props.ui?.root] })"
    :default-value="defaultValue"
    :name="name"
    :disabled="disabled"
    @input="onInput"
  >
    <div :class="ui.container({ class: props.ui?.container })">
      <NumberFieldDecrement>
        <UIcon :name="appConfig.ui.icons.minus" :class="ui.icon({ class: props.ui?.icon })" />
      </NumberFieldDecrement>
      <NumberFieldInput
        v-bind="$attrs"
        :placeholder="placeholder"
        :required="required"
        :class="ui.base({ class: props.ui?.base })"
      />
      <NumberFieldIncrement>
        <UIcon :name="appConfig.ui.icons.plus" :class="ui.icon({ class: props.ui?.icon })" />
      </NumberFieldIncrement>
    </div>
  </NumberFieldRoot>
</template>
