<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/input'
import type { UseComponentIconsProps } from '#ui/composables/useComponentIcons'

const appConfig = _appConfig as AppConfig & { ui: { input: Partial<typeof theme> } }

const input = tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })

type InputVariants = VariantProps<typeof input>

export interface InputProps extends UseComponentIconsProps {
  id?: string
  name?: string
  type?: InputHTMLAttributes['type']
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
}

export interface InputSlots {
  leading(): any
  default(): any
  trailing(): any
}
</script>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useComponentIcons, useFormField } from '#imports'
import { looseToNumber } from '#ui/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autofocusDelay: 100
})

const [modelValue, modelModifiers] = defineModel<string | number>()

const emit = defineEmits<InputEmits>()
defineSlots<InputSlots>()

const { emitFormBlur, emitFormInput, size, color, inputId, name, disabled } = useFormField<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)
// const { size: sizeButtonGroup, rounded } = useInjectButtonGroup({ ui, props })

// const size = computed(() => sizeButtonGroup.value || sizeFormGroup.value)

const ui = computed(() => tv({ extend: input, slots: props.ui })({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  loading: props.loading,
  leading: isLeading.value,
  trailing: isTrailing.value
}))

const inputRef = ref<HTMLInputElement | null>(null)

function autoFocus () {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
function updateInput (value: string) {
  if (modelModifiers.trim) {
    value = value.trim()
  }

  if (modelModifiers.number || props.type === 'number') {
    value = looseToNumber(value)
  }

  modelValue.value = value
  emitFormInput()
}

function onInput (event: Event) {
  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange (event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }
}

function onBlur (event: FocusEvent) {
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

    <span v-if="(isLeading && leadingIconName) || $slots.leading" :class="ui.leading()">
      <slot name="leading">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon()" />
      </slot>
    </span>

    <span v-if="(isTrailing && trailingIconName) || $slots.trailing" :class="ui.trailing()">
      <slot name="trailing">
        <UIcon v-if="isTrailing && trailingIconName" :name="trailingIconName" :class="ui.trailingIcon()" />
      </slot>
    </span>
  </div>
</template>
