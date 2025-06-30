<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/textarea'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type Textarea = ComponentConfig<typeof theme, AppConfig, 'textarea'>

type TextareaValue = string | number | null

export interface TextareaProps<T extends TextareaValue = TextareaValue> extends UseComponentIconsProps {
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
  color?: Textarea['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Textarea['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Textarea['variants']['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  autoresize?: boolean
  autoresizeDelay?: number
  disabled?: boolean
  rows?: number
  maxrows?: number
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  modelValue?: T
  defaultValue?: T
  modelModifiers?: {
    string?: boolean
    number?: boolean
    trim?: boolean
    lazy?: boolean
    nullify?: boolean
  }
  class?: any
  ui?: Textarea['slots']
}

export interface TextareaEmits<T extends TextareaValue = TextareaValue> {
  (e: 'update:modelValue', payload: T): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface TextareaSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts" generic="T extends TextareaValue">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TextareaProps<T>>(), {
  rows: 3,
  maxrows: 0,
  autofocusDelay: 0,
  autoresizeDelay: 0
})
const emits = defineEmits<TextareaEmits<T>>()
const slots = defineSlots<TextareaSlots>()

const modelValue = useVModel<TextareaProps<T>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const appConfig = useAppConfig() as Textarea['AppConfig']

const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField<TextareaProps<T>>(props, { deferInputValidation: true })
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.textarea || {}) })({
  color: color.value,
  variant: props.variant,
  size: size?.value,
  loading: props.loading,
  highlight: highlight.value,
  autoresize: props.autoresize,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing
}))

const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Custom function to handle the v-model properties
function updateInput(value: string | null) {
  if (props.modelModifiers?.trim) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number) {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullify) {
    value ||= null
  }

  modelValue.value = value as T
  emitFormInput()
}

function onInput(event: Event) {
  autoResize()

  if (!props.modelModifiers?.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (props.modelModifiers?.lazy) {
    updateInput(value)
  }

  // Update trimmed textarea so that it has same behavior as native textarea https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (props.modelModifiers?.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }

  emitFormChange()
  emits('change', event)
}

function onBlur(event: FocusEvent) {
  emitFormBlur()
  emits('blur', event)
}

function autoFocus() {
  if (props.autofocus) {
    textareaRef.value?.focus()
  }
}

function autoResize() {
  if (props.autoresize && textareaRef.value) {
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

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)

  setTimeout(() => {
    autoResize()
  }, props.autoresizeDelay)
})

defineExpose({
  textareaRef
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
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

    <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing">
        <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
