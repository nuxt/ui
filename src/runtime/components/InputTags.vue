<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-tags'
import type { TagsInputRootProps, AcceptableInputValue } from 'reka-ui'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { InputProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type InputTags = ComponentConfig<typeof theme, AppConfig, 'inputTags'>

export type InputTagItem = AcceptableInputValue

export interface InputTagsProps<
  T extends InputTagItem = InputTagItem
> extends Pick<TagsInputRootProps, 'name' | 'disabled' | 'addOnBlur' | 'addOnPaste' | 'addOnTab' | 'delimiter' | 'dir' | 'duplicate' | 'max' | 'convertValue' | 'displayValue'>, UseComponentIconsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: InputTags['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: InputTags['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputTags['variants']['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon displayed to delete a tag.
   * Works only when `multiple` is `true`.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  deleteIcon?: string
  /** The value of the InputMenu when initially rendered. Use when you do not need to control the state of the InputMenu. */
  defaultValue?: T[]
  /** The controlled value of the InputMenu. Can be binded-with with `v-model`. */
  modelValue?: T[]
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: InputTags['slots']
}

export type InputTagsEmits<T extends InputTagItem> = {
  'update:modelValue': [payload: T[]]
  'change': [payload: Event]
  'blur': [payload: FocusEvent]
  'focus': [payload: FocusEvent]
}

type SlotProps<T extends InputTagItem> = (props: { item: T, index: number }) => any

export interface InputTagsSlots<
  T extends InputTagItem = InputTagItem
> {
  'tags-item-text': SlotProps<T>
  'tags-item-delete': SlotProps<T>
  'leading': () => any
  'trailing': () => any
}
</script>

<script setup lang="ts" generic="T extends InputTagItem">
import { computed, ref, onMounted, toRaw } from 'vue'
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputTagsProps<T>>(), {
  type: 'text',
  autofocusDelay: 0,
  labelKey: 'label' as never,
  defaultValue: () => []
})
const emits = defineEmits<InputTagsEmits<T>>()

const slots = defineSlots<InputTagsSlots<T>>()

const appConfig = useAppConfig() as InputTags['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'required', 'delimiter', 'dir', 'max', 'duplicate', 'addOnBlur', 'addOnPaste', 'addOnTab', 'convertValue', 'displayValue'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTags || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

const inputRef = ref<InstanceType<typeof TagsInputInput> | null>(null)

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

defineExpose({
  inputRef
})

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
  }
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
  emitFormBlur()
}

function onFocus(event: FocusEvent) {
  emits('focus', event)
  emitFormFocus()
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <TagsInputRoot
    :id="id"
    v-slot="{ modelValue: tags }"
    :class="[ui.root({ class: [props.ui?.root, props.class] }), ui.base({ class: props.ui?.base })]"
    v-bind="rootProps"
    :name="name"
    :model-value="modelValue"
    :disabled="disabled"
    :required="required"
    @update:model-value="onUpdate"
    @blur="onBlur"
    @focus="onFocus"
  >
    <TagsInputItem
      v-for="(item, index) in tags"
      :key="index"
      :value="item"
      :class="ui.item({ class: [props.ui?.item] })"
    >
      <TagsInputItemText :class="ui.itemText({ class: [props.ui?.itemText] })">
        <slot v-if="slots['tags-item-text']" name="tags-item-text" :item="(item as T)" :index="index" />
      </TagsInputItemText>

      <TagsInputItemDelete
        :class="ui.itemDelete({ class: [props.ui?.itemDelete] })"
        :disabled="disabled"
      >
        <slot name="tags-item-delete" :item="(item as T)" :index="index">
          <UIcon :name="deleteIcon || appConfig.ui.icons.close" :class="ui.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })" />
        </slot>
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :placeholder="placeholder"
      :class="ui.input({ class: props.ui?.input })"
    />

    <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing">
        <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </TagsInputRoot>
</template>
