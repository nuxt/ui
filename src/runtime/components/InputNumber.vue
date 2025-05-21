<script lang="ts">
import type { NumberFieldRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-number'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type InputNumber = ComponentConfig<typeof theme, AppConfig, 'inputNumber'>

export interface InputNumberProps extends Pick<NumberFieldRootProps, 'modelValue' | 'defaultValue' | 'min' | 'max' | 'step' | 'stepSnapping' | 'disabled' | 'required' | 'id' | 'name' | 'formatOptions' | 'disableWheelChange'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The placeholder text when the input is empty. */
  placeholder?: string
  color?: InputNumber['variants']['color']
  variant?: InputNumber['variants']['variant']
  size?: InputNumber['variants']['size']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * The orientation of the input menu.
   * @defaultValue 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal'
  /**
   * Configure the increment button. The `color` and `size` are inherited.
   * @defaultValue { variant: 'link' }
   */
  increment?: ButtonProps
  /**
   * The icon displayed to increment the value.
   * @defaultValue appConfig.ui.icons.plus
   * @IconifyIcon
   */
  incrementIcon?: string
  /** Disable the increment button. */
  incrementDisabled?: boolean
  /**
   * Configure the decrement button. The `color` and `size` are inherited.
   * @defaultValue { variant: 'link' }
   */
  decrement?: ButtonProps
  /**
   * The icon displayed to decrement the value.
   * @defaultValue appConfig.ui.icons.minus
   * @IconifyIcon
   */
  decrementIcon?: string
  /** Disable the decrement button. */
  decrementDisabled?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The locale to use for formatting and parsing numbers.
   * @defaultValue UApp.locale.code
   */
  locale?: string
  class?: any
  ui?: InputNumber['slots']
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
import { onMounted, ref, computed } from 'vue'
import { NumberFieldRoot, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UButton from './Button.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputNumberProps>(), {
  orientation: 'horizontal',
  disabledIncrement: false,
  disabledDecrement: false
})
const emits = defineEmits<InputNumberEmits>()
defineSlots<InputNumberSlots>()

const { t, code: codeLocale } = useLocale()
const appConfig = useAppConfig() as InputNumber['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'min', 'max', 'step', 'stepSnapping', 'formatOptions', 'disableWheelChange'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, id, color, size: formGroupSize, name, highlight, disabled, ariaAttrs } = useFormField<InputNumberProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputNumberProps>(props)

const locale = computed(() => props.locale || codeLocale.value)
const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputNumber || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize.value,
  highlight: highlight.value,
  orientation: props.orientation,
  buttonGroup: orientation.value
}))

const incrementIcon = computed(() => props.incrementIcon || (props.orientation === 'horizontal' ? appConfig.ui.icons.plus : appConfig.ui.icons.chevronUp))
const decrementIcon = computed(() => props.decrementIcon || (props.orientation === 'horizontal' ? appConfig.ui.icons.minus : appConfig.ui.icons.chevronDown))

const inputRef = ref<InstanceType<typeof NumberFieldInput> | null>(null)

function onUpdate(value: number) {
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

defineExpose({
  inputRef
})
</script>

<template>
  <NumberFieldRoot
    v-bind="rootProps"
    :id="id"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :name="name"
    :disabled="disabled"
    :locale="locale"
    @update:model-value="onUpdate"
  >
    <NumberFieldInput
      v-bind="{ ...$attrs, ...ariaAttrs }"
      ref="inputRef"
      :placeholder="placeholder"
      :required="required"
      :class="ui.base({ class: props.ui?.base })"
      @blur="onBlur"
      @focus="emitFormFocus"
    />

    <div :class="ui.increment({ class: props.ui?.increment })">
      <NumberFieldIncrement as-child :disabled="disabled || incrementDisabled">
        <slot name="increment">
          <UButton
            :icon="incrementIcon"
            :color="color"
            :size="size"
            variant="link"
            :aria-label="t('inputNumber.increment')"
            v-bind="typeof increment === 'object' ? increment : undefined"
          />
        </slot>
      </NumberFieldIncrement>
    </div>

    <div :class="ui.decrement({ class: props.ui?.decrement })">
      <NumberFieldDecrement as-child :disabled="disabled || decrementDisabled">
        <slot name="decrement">
          <UButton
            :icon="decrementIcon"
            :color="color"
            :size="size"
            variant="link"
            :aria-label="t('inputNumber.decrement')"
            v-bind="typeof decrement === 'object' ? decrement : undefined"
          />
        </slot>
      </NumberFieldDecrement>
    </div>
  </NumberFieldRoot>
</template>
