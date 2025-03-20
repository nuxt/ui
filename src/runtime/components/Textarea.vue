<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/textarea'
import { tv } from '../utils/tv'
import type { PartialString } from '../types/utils'

const appConfigTextarea = _appConfig as AppConfig & { ui: { textarea: Partial<typeof theme> } }

const textarea = tv({ extend: tv(theme), ...(appConfigTextarea.ui?.textarea || {}) })

type TextareaVariants = VariantProps<typeof textarea>

export interface TextareaProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  /** The placeholder text when the textarea is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: TextareaVariants['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: TextareaVariants['variant']
  /**
   * @defaultValue 'md'
   */
  size?: TextareaVariants['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  class?: any
  rows?: number
  maxrows?: number
  autoresize?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  ui?: PartialString<typeof textarea.slots>
}

export interface TextareaEmits {
  (e: 'update:modelValue', payload: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface TextareaSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 3,
  maxrows: 0,
  autofocusDelay: 0
})
defineSlots<TextareaSlots>()
const emits = defineEmits<TextareaEmits>()

const [modelValue, modelModifiers] = defineModel<string | number | null>()

const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField<TextareaProps>(props, { deferInputValidation: true })

const ui = computed(() => textarea({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  highlight: highlight.value
}))

const textareaRef = ref<HTMLTextAreaElement | null>(null)

function autoFocus() {
  if (props.autofocus) {
    textareaRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
function updateInput(value: string | null) {
  if (modelModifiers.trim) {
    value = value?.trim() ?? null
  }

  if (modelModifiers.number) {
    value = looseToNumber(value)
  }

  if (modelModifiers.nullify) {
    value ||= null
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
    const overflow = textareaRef.value.style.overflow
    textareaRef.value.style.overflow = 'hidden'

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

    textareaRef.value.style.overflow = overflow
  }
}

watch(modelValue, () => {
  nextTick(autoResize)
})

defineExpose({
  textareaRef
})

onMounted(() => {
  setTimeout(() => {
    autoResize()
  }, 100)
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="rows"
      :placeholder="placeholder"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="required"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    />

    <slot />
  </Primitive>
</template>
