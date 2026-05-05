<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { InputHTMLAttributes } from '../types/html'
import type { ModelModifiers, ApplyModifiers } from '../types/input'
import type { AcceptableValue } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Input = ComponentConfig<typeof theme, AppConfig, 'input'>

export type InputValue = AcceptableValue

export interface InputProps<T extends InputValue = InputValue, Mod extends ModelModifiers = ModelModifiers> extends UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'name' | 'type' | 'placeholder' | 'required' | 'autocomplete' | 'autofocus' | 'disabled'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  type?: InputHTMLAttributes['type']
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: Input['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: Input['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: Input['variants']['size']
  required?: boolean
  autocomplete?: InputHTMLAttributes['autocomplete']
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /** Keep the mobile text size on all breakpoints. */
  fixed?: boolean
  modelValue?: ApplyModifiers<T, Mod>
  defaultValue?: ApplyModifiers<T, Mod>
  modelModifiers?: Mod
  class?: any
  ui?: Input['slots']
}

export interface InputEmits<T extends InputValue = InputValue, Mod extends ModelModifiers = ModelModifiers> {
  'update:modelValue': [value: ApplyModifiers<T, Mod>]
  'blur': [event: FocusEvent]
  'change': [event: Event]
}

export interface InputSlots {
  leading?(props: { ui: Input['ui'] }): VNode[]
  default?(props: { ui: Input['ui'] }): VNode[]
  trailing?(props: { ui: Input['ui'] }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends InputValue, Mod extends ModelModifiers">
import { useTemplateRef, computed, onMounted } from 'vue'
import { Primitive } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { looseToNumber } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<InputProps<T, Mod>>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0
})
const emits = defineEmits<InputEmits<T, Mod>>()
const slots = defineSlots<InputSlots>()

const props = useComponentProps<InputProps<T, Mod>>('input', _props)

// eslint-disable-next-line vue/no-dupe-keys
const modelValue = useVModel<InputProps<T, Mod>, 'modelValue', 'update:modelValue'>(props, 'modelValue', emits, { defaultValue: props.defaultValue })

const appConfig = useAppConfig() as Input['AppConfig']

const { emitFormBlur, emitFormInput, emitFormChange, size: formFieldSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField<InputProps<T>>(_props, { deferInputValidation: true })
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps<T>>(_props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => fieldGroupSize.value || formFieldSize.value)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })({
  type: props.type as Input['variants']['type'],
  color: color.value ?? props.color,
  variant: props.variant,
  size: inputSize?.value ?? props.size,
  loading: props.loading,
  highlight: highlight.value ?? props.highlight,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputRef = useTemplateRef('inputRef')

// Custom function to handle the v-model properties
function updateInput(value: string | null | undefined) {
  if (props.modelModifiers?.trim && (typeof value === 'string' || value === null || value === undefined)) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number || props.type === 'number') {
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
  if (!props.modelModifiers?.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (props.modelModifiers?.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
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
    inputRef.value?.focus()
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
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <input
      :id="id"
      ref="inputRef"
      :type="props.type"
      :value="modelValue"
      :name="name"
      :placeholder="props.placeholder"
      data-slot="base"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="props.required"
      :autocomplete="props.autocomplete"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
      @focus="emitFormFocus"
    >

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
