<script lang="ts">
// TODO: Add missing props / slots (e.g. icons)
import { tv, type VariantProps } from 'tailwind-variants'
import { defu } from 'defu'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input'
import { looseToNumber } from '../utils'

const appConfig = _appConfig as AppConfig & { ui: { input: Partial<typeof theme> } }

const input = tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })

type InputVariants = VariantProps<typeof input>

export interface InputProps {
  id?: string | number
  name?: string
  type?: string
  required?: boolean
  color?: InputVariants['color']
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  modelValue?: string
  placeholder?: string
  autofocus?: boolean
  autofocusDelay?: number
  modelModifiers?: {
    trim?: boolean
    lazy?: boolean
    number?: boolean
  }
  disabled?: boolean
  class?: any
  ui?: Partial<typeof input.slots>
}

export interface InputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
}

export interface InputSlots {
  leading(props: {
    disabled?: boolean
    loading?: boolean
    icon?: string
    class: string
  }): any
  default(): any
  trailing(props: {
    disabled?: boolean
    loading?: boolean
    icon?: string
    class: string
  }): any
}
</script>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useFormField } from '../composables/useFormField'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autofocusDelay: 100
})
const emit = defineEmits<InputEmits>()
defineSlots<InputSlots>()

const { emitFormBlur, emitFormInput, size, color, inputId, name, disabled } = useFormField(props)

const ui = computed(() => tv({ extend: input, slots: props.ui })({
  color: color.value,
  variant: props.variant,
  size: size?.value
}))

// const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })

// const size = computed(() => sizeButtonGroup.value || sizeFormGroup.value)

const modelModifiers = ref(defu({}, props.modelModifiers, { trim: false, lazy: false, number: false }))

const inputRef = ref<HTMLInputElement | null>(null)

const autoFocus = () => {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
const updateInput = (value: string) => {
  if (modelModifiers.value.trim) {
    value = value.trim()
  }

  if (modelModifiers.value.number || props.type === 'number') {
    value = looseToNumber(value)
  }

  emit('update:modelValue', value)
  emitFormInput()
}

const onInput = (event: Event) => {
  if (!modelModifiers.value.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

const onChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.value.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.value.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }
}

const onBlur = (event: FocusEvent) => {
  emitFormBlur()
  emit('blur', event)
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
      :id="inputId"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="ui.base()"
      :disabled="disabled"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    >
    <slot />

    <!-- span
      v-if="(isLeading && leadingIconName) || $slots.leading"
      :class="leadingWrapperIconClass"
    >
      <slot name="leading" :disabled="disabled" :loading="loading">
        <UIcon :name="leadingIconName" :class="leadingIconClass" />
      </slot>
    </span>

    <span
      v-if="(isTrailing && trailingIconName) || $slots.trailing"
      :class="trailingWrapperIconClass"
    >
      <slot name="trailing" :disabled="disabled" :loading="loading">
        <UIcon :name="trailingIconName" :class="trailingIconClass" />
      </slot>
    </span -->
  </div>
</template>
