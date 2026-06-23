<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/textarea'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { TextareaHTMLAttributes } from '../types/html'
import type { ModelModifiers, ApplyModifiers } from '../types/input'
import type { ComponentConfig } from '../types/tv'

type Textarea = ComponentConfig<typeof theme, AppConfig, 'textarea'>

type TextareaValue = string | number | null

export interface TextareaProps<T extends TextareaValue = TextareaValue, Mod extends ModelModifiers = ModelModifiers> extends UseComponentIconsProps, /** @vue-ignore */ Omit<TextareaHTMLAttributes, 'name' | 'placeholder' | 'required' | 'autofocus' | 'disabled' | 'rows'> {
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
  /** Keep the mobile text size on all breakpoints. */
  fixed?: boolean
  defaultValue?: ApplyModifiers<T, Mod>
  modelValue?: ApplyModifiers<T, Mod>
  modelModifiers?: Mod
  class?: any
  ui?: Textarea['slots']
}

export interface TextareaEmits<T extends TextareaValue = TextareaValue, Mod extends ModelModifiers = ModelModifiers> {
  'update:modelValue': [value: ApplyModifiers<T, Mod>]
  'blur': [event: FocusEvent]
  'change': [event: Event]
}

export interface TextareaSlots {
  leading?(props: { ui: Textarea['ui'] }): VNode[]
  default?(props: { ui: Textarea['ui'] }): VNode[]
  trailing?(props: { ui: Textarea['ui'] }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends TextareaValue, Mod extends ModelModifiers = ModelModifiers">
import { useTemplateRef, computed, onMounted, nextTick, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<TextareaProps<T, Mod>>(), {
  rows: 3,
  maxrows: 0,
  autofocusDelay: 0,
  autoresizeDelay: 0
})
const emits = defineEmits<TextareaEmits<T, Mod>>()
const slots = defineSlots<TextareaSlots>()

const props = useComponentProps<TextareaProps<T, Mod>>('textarea', _props)

// eslint-disable-next-line vue/no-dupe-keys
const modelValue = useVModel<TextareaProps<T, Mod>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const appConfig = useAppConfig() as Textarea['AppConfig']

const { emitFormFocus, emitFormBlur, emitFormInput, emitFormChange, size, color, id, name, highlight, disabled, ariaAttrs } = useFormField<TextareaProps<T>>(_props, { deferInputValidation: true })
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.textarea || {}) })({
  color: color.value ?? props.color,
  variant: props.variant,
  size: size?.value ?? props.size,
  loading: props.loading,
  highlight: highlight.value ?? props.highlight,
  fixed: props.fixed,
  autoresize: props.autoresize,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing
}))

const textareaRef = useTemplateRef('textareaRef')

// Custom function to handle the v-model properties
function updateInput(value: string | null | undefined) {
  if (props.modelModifiers?.trim && (typeof value === 'string' || value === null || value === undefined)) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number) {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullable) {
    value ||= null
  }

  if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) {
    value ||= undefined
  }

  modelValue.value = value as ApplyModifiers<T, Mod>
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
    textareaRef.value.rows = props.rows!
    const overflow = textareaRef.value.style.overflow
    textareaRef.value.style.overflow = 'hidden'

    const styles = window.getComputedStyle(textareaRef.value)
    const paddingTop = Number.parseInt(styles.paddingTop)
    const paddingBottom = Number.parseInt(styles.paddingBottom)
    const padding = paddingTop + paddingBottom
    const lineHeight = Number.parseInt(styles.lineHeight)
    const { scrollHeight } = textareaRef.value
    const newRows = (scrollHeight - padding) / lineHeight

    if (newRows > props.rows!) {
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

  setTimeout(async () => {
    await nextTick()
    autoResize()
  }, props.autoresizeDelay)
})

defineExpose({
  textareaRef,
  autoResize
})
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <textarea
      :id="id"
      ref="textareaRef"
      :value="modelValue"
      :name="name"
      :rows="props.rows"
      :placeholder="props.placeholder"
      data-slot="base"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="props.required"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    />

    <slot :ui="ui" />

    <span v-if="isLeading || !!props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!props.avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="props.avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
