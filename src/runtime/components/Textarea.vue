<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/textarea'

const appConfig = _appConfig as AppConfig & { ui: { textarea: Partial<typeof theme> } }

const textarea = tv({ extend: tv(theme), ...(appConfig.ui?.textarea || {}) })

type TextareaVariants = VariantProps<typeof textarea>

export interface TextareaProps {
  id?: string
  name?: string
  /** The placeholder text when the textarea is empty. */
  placeholder?: string
  color?: TextareaVariants['color']
  variant?: TextareaVariants['variant']
  size?: TextareaVariants['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  class?: any
  rows?: number
  maxrows?: number
  autoresize?: boolean
  ui?: Partial<typeof textarea.slots>
}

export interface TextareaEmits {
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
  (e: 'update:modelValue', payload: string | number): void
}

export interface TextareaSlots {
  default(props?: {}): any
}
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useFormField } from '#imports'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  maxrows: 0,
  autofocusDelay: 0
})
defineSlots<TextareaSlots>()
const emits = defineEmits<TextareaEmits>()

const [modelValue, modelModifiers] = defineModel<string | number>()

const { emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, disabled } = useFormField<TextareaProps>(props)

const ui = computed(() => tv({ extend: textarea, slots: props.ui })({
  color: color.value,
  variant: props.variant,
  size: size?.value
}))

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function autoFocus() {
  if (props.autofocus) {
    textareaRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
function updateInput(value: string) {
  if (modelModifiers.trim) {
    value = value.trim()
  }

  if (modelModifiers.number) {
    value = looseToNumber(value)
  }

  modelValue.value = value
  emitFormInput()
}

function onInput(event: Event) {
  autoResize()

  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.lazy) {
    updateInput(value)
  }

  // Update trimmed textarea so that it has same behavior as native textarea https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }

  emitFormChange()
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

function autoResize() {
  if (props.autoresize) {
    if (!textareaRef.value) {
      return
    }

    textareaRef.value.rows = props.rows

    const styles = window.getComputedStyle(textareaRef.value)
    const paddingTop = Number.parseInt(styles.paddingTop)
    const paddingBottom = Number.parseInt(styles.paddingBottom)
    const padding = paddingTop + paddingBottom
    const lineHeight = Number.parseInt(styles.lineHeight)
    const { scrollHeight } = textareaRef.value
    const newRows = (scrollHeight - padding) / lineHeight

    if (newRows > props.rows) {
      textareaRef.value.rows = props.maxrows ? Math.min(newRows, props.maxrows) : newRows
    }
  }
}

watch(() => modelValue, () => {
  nextTick(autoResize)
})

onMounted(() => {
  setTimeout(() => {
    autoResize()
  }, 100)
})
</script>

<template>
  <div :class="ui.root({ class: props.class })">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :class="ui.base()"
      :disabled="disabled"
      :required="required"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    />

    <slot />
  </div>
</template>
