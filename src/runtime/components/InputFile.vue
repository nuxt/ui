<script lang="ts">
import type { InputHTMLAttributes } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-file'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type Input = ComponentConfig<typeof theme, AppConfig, 'input'>

export interface InputProps extends UseComponentIconsProps {
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
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: Input['slots']
  /** The file input element */
  multiple?: boolean
  count?: boolean
}

export interface InputEmits {
  (e: 'update:modelValue', value: File | File[] | null): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface InputSlots {
  leading(props?: {}): any
  default(props?: {}): any
  trailing(props?: {}): any
}
</script>

<script setup lang="ts" generic="T extends File | File[]">
import { ref, computed, onMounted, watch } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const { t } = useLocale()

const props = withDefaults(defineProps<InputProps>(), {
  autofocusDelay: 0
})
const emits = defineEmits<InputEmits>()
const slots = defineSlots<InputSlots>()

const [modelValue, modelModifiers] = defineModel<T>()

const appConfig = useAppConfig() as Input['AppConfig']

const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, emitFormFocus, ariaAttrs } = useFormField<InputProps>(props, { deferInputValidation: true })
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.input || {}) })({
  type: props.type as Input['variants']['type'],
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const inputRef = ref<HTMLInputElement | null>(null)

// Custom function to handle the v-model properties
function updateInput(Event: EventTarget) {
  const input = Event as HTMLInputElement
  let files: File | File[] | null = null
  if (props.multiple) {
    files = input.files ? Array.from(input.files) : []
  } else {
    files = input.files && input.files[0] ? input.files[0] : null
  }

  if (modelModifiers.nullify) {
    files ||= null
  }

  modelValue.value = files as T
  emitFormInput()
}

function onInput(event: Event) {
  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement))
  }
}

function onChange(event: Event) {
  if (modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement))
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

function onInputClick() {
  if (inputRef.value) {
    inputRef.value.click()
  }
}

// Watch for external modelValue changes to reset/clear the input
watch(modelValue, (val) => {
  if (!val && inputRef.value) {
    inputRef.value.value = ''
  }
})

const fileNames = computed(() => {
  const value = modelValue.value
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter(f => f instanceof File).map(f => f.name)
  }
  if (value instanceof File) {
    return [value.name]
  }
  return []
})

const fileCountLabel = computed(() => {
  if (!props.count) return null
  const value = modelValue.value
  if (Array.isArray(value) && value.length > 1) {
    return `${value.length} ${t('inputFile.files')}`
  }
  return null
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="[ui.base({ class: props.ui?.base }), disabled && 'cursor-not-allowed opacity-75']" :aria-disabled="!!disabled" @click="onInputClick()">
      <span v-if="!fileNames.length" class="text-dimmed">{{ placeholder || t('inputFile.empty') }}</span>
      <span v-else-if="fileCountLabel">{{ fileCountLabel }}</span>
      <span v-else>{{ fileNames.join(', ') }}</span>
      <input
        :id="id"
        ref="inputRef"
        type="file"
        :name="name"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        class="hidden"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        @input="onInput"
        @blur="onBlur"
        @change="onChange"
        @focus="emitFormFocus"
      >
    </div>

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
