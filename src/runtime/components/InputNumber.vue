<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { NumberFieldRootProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input-number'

const appConfig = _appConfig as AppConfig & { ui: { inputNumber: Partial<typeof theme> } }

const inputNumber = tv({ extend: tv(theme), ...(appConfig.ui?.inputNumber || {}) })

type InputNumberVariants = VariantProps<typeof inputNumber>

export interface InputNumberProps extends Pick<NumberFieldRootProps, 'modelValue' | 'defaultValue' | 'min' | 'max' | 'step' | 'disabled' | 'required' | 'id'> {
  class?: any
  /** The placeholder text when the input is empty. */
  placeholder?: string
  ui?: Partial<typeof inputNumber.slots>
  color?: InputNumberVariants['color']
  variant?: InputNumberVariants['variant']
  size?: InputNumberVariants['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * The orientation of the input menu.
   * @defaultValue 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal'
  /**
   * The icon displayed to increment the value.
   * @defaultValue appConfig.ui.icons.plus
   */
  incrementIcon?: string
  /**
   * The icon displayed to decrement the value.
   * @defaultValue appConfig.ui.icons.minus
   */
  decrementIcon?: string
  autofocus?: boolean
  autofocusDelay?: number
}

export interface InputNumberEmits {
  (e: 'update:modelValue', payload: number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', payload: Event): void
}

export interface InputNumberSlots {
  increment(props?: {}): any
  decrement(props?: {}): any
}
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
import { onMounted, ref, computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputNumberProps>(), {
  orientation: 'horizontal'
})
const emits = defineEmits<InputNumberEmits>()
defineSlots<InputNumberSlots>()

const modelValue = defineModel<number>()

const rootProps = useForwardPropsEmits(reactivePick(props), emits)

const { emitFormBlur, emitFormChange, emitFormInput, id, color, size, name, highlight, disabled } = useFormField<InputNumberProps>(props)

const ui = computed(() => inputNumber({
  color: color.value,
  variant: props.variant,
  size: size.value,
  highlight: highlight.value,
  orientation: props.orientation
}))

const incrementIcon = computed(() => props.incrementIcon || (props.orientation === 'horizontal' ? appConfig.ui.icons.plus : appConfig.ui.icons.increment))
const decrementIcon = computed(() => props.decrementIcon || (props.orientation === 'horizontal' ? appConfig.ui.icons.minus : appConfig.ui.icons.decrement))

const inputRef = ref<InstanceType<typeof NumberFieldInput> | null>(null)

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onInput(value: number) {
  modelValue.value = value

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)

  emitFormChange()
  emitFormInput()
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

defineExpose({
  inputRef
})
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
    <NumberFieldInput
      v-bind="$attrs"
      ref="inputRef"
      :placeholder="placeholder"
      :required="required"
      :class="ui.base({ class: props.ui?.base })"
      @blur="onBlur"
    />
    <NumberFieldIncrement :class="ui.increment({ class: props.ui?.increment })" :disabled="disabled">
      <slot name="increment">
        <UIcon :name="incrementIcon" :class="ui.incrementIcon({ class: props.ui?.incrementIcon })" />
      </slot>
    </NumberFieldIncrement>
    <NumberFieldDecrement :class="ui.decrement({ class: props.ui?.decrement })" :disabled="disabled">
      <slot name="decrement">
        <UIcon :name="decrementIcon" :class="ui.decrementIcon({ class: props.ui?.decrementIcon })" />
      </slot>
    </NumberFieldDecrement>
  </NumberFieldRoot>
</template>
