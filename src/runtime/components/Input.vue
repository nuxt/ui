<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'

const appConfig = _appConfig as AppConfig & { ui: { input: Partial<typeof theme> } }

const input = tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })

type InputVariants = VariantProps<typeof input>

export interface InputProps extends UseComponentIconsProps {
  id?: string
  name?: string
  type?: InputHTMLAttributes['type']
  /** The placeholder text when the input is empty. */
  placeholder?: string
  color?: InputVariants['color']
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  class?: any
  ui?: Partial<typeof input.slots>
}

export interface InputEmits {
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
  (e: 'update:modelValue', payload: string | number): void
}

export interface InputSlots {
  leading(props?: any): any
  default(props?: any): any
  trailing(props?: any): any
}
</script>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useComponentIcons, useFormField, useButtonGroup } from '#imports'
import { UIcon } from '#components'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autofocusDelay: 0
})
const emits = defineEmits<InputEmits>()
const slots = defineSlots<InputSlots>()

const [modelValue, modelModifiers] = defineModel<string | number>()

const { emitFormBlur, emitFormInput, size: formGroupSize, color, id, name, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: input, slots: props.ui })({
  type: props.type as InputVariants['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  leading: isLeading.value || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const inputRef = ref<HTMLInputElement | null>(null)

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
function updateInput(value: string) {
  if (modelModifiers.trim) {
    value = value.trim()
  }

  if (modelModifiers.number || props.type === 'number') {
    value = looseToNumber(value)
  }

  modelValue.value = value
  emitFormInput()
}

function onInput(event: Event) {
  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }

  emits('change', event)
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <input
      :id="id"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="ui.base()"
      :disabled="disabled"
      :required="required"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    >

    <slot />

    <span v-if="isLeading || !!slots.leading" :class="ui.leading()">
      <slot name="leading">
        <UIcon v-if="leadingIconName" :name="leadingIconName" :class="ui.leadingIcon()" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing()">
      <slot name="trailing">
        <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon()" />
      </slot>
    </span>
  </div>
</template>
