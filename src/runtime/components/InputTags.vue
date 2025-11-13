<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { TagsInputRootProps, TagsInputRootEmits, AcceptableInputValue } from 'reka-ui'
import theme from '#build/ui/input-tags'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, IconProps } from '../types'
import type { InputHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type InputTags = ComponentConfig<typeof theme, AppConfig, 'inputTags'>

export type InputTagItem = AcceptableInputValue

export interface InputTagsProps<T extends InputTagItem = InputTagItem> extends Pick<TagsInputRootProps<T>, 'modelValue' | 'defaultValue' | 'addOnPaste' | 'addOnTab' | 'addOnBlur' | 'duplicate' | 'disabled' | 'delimiter' | 'max' | 'id' | 'convertValue' | 'displayValue' | 'name' | 'required'>, UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'disabled' | 'max' | 'required' | 'name' | 'placeholder' | 'type' | 'autofocus' | 'maxlength' | 'minlength' | 'pattern' | 'size' | 'min' | 'step'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /** The maximum number of character allowed. */
  maxLength?: number
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
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon displayed to delete a tag.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  deleteIcon?: IconProps['name']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: InputTags['slots']
}

export interface InputTagsEmits<T extends InputTagItem> extends TagsInputRootEmits<T> {
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}

type SlotProps<T extends InputTagItem> = (props: { item: T, index: number, ui: InputTags['ui'] }) => any

export interface InputTagsSlots<T extends InputTagItem = InputTagItem> {
  'leading'(props: { ui: InputTags['ui'] }): any
  'default'(props: { ui: InputTags['ui'] }): any
  'trailing'(props: { ui: InputTags['ui'] }): any
  'item-text': SlotProps<T>
  'item-delete': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends InputTagItem">
import { computed, useTemplateRef, onMounted, toRaw, toRef } from 'vue'
import { TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputTagsProps<T>>(), {
  type: 'text',
  autofocusDelay: 0
})
const emits = defineEmits<InputTagsEmits<T>>()
const slots = defineSlots<InputTagsSlots<T>>()

const appConfig = useAppConfig() as InputTags['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'addOnPaste', 'addOnTab', 'addOnBlur', 'duplicate', 'delimiter', 'max', 'convertValue', 'displayValue', 'required'), emits)

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputTagsProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputTagsProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputTags || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value
}))

const inputRef = useTemplateRef('inputRef')

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: T[]) {
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

defineExpose({
  inputRef: toRef(() => inputRef.value?.$el as HTMLInputElement)
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <TagsInputRoot
    :id="id"
    v-slot="{ modelValue: tags }"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="root"
    :class="ui.root({ class: [ui.base({ class: props.ui?.base }), props.ui?.root, props.class] })"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
  >
    <TagsInputItem
      v-for="(item, index) in tags"
      :key="index"
      :value="item"
      data-slot="item"
      :class="ui.item({ class: [props.ui?.item] })"
    >
      <TagsInputItemText data-slot="itemText" :class="ui.itemText({ class: [props.ui?.itemText] })">
        <slot v-if="!!slots['item-text']" name="item-text" :item="(item as T)" :index="index" :ui="ui" />
      </TagsInputItemText>

      <TagsInputItemDelete
        data-slot="itemDelete"
        :class="ui.itemDelete({ class: [props.ui?.itemDelete] })"
        :disabled="disabled"
      >
        <slot name="item-delete" :item="(item as T)" :index="index" :ui="ui">
          <UIcon :name="deleteIcon || appConfig.ui.icons.close" data-slot="itemDeleteIcon" :class="ui.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })" />
        </slot>
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :placeholder="placeholder"
      :max-length="maxLength"
      data-slot="input"
      :class="ui.input({ class: props.ui?.input })"
      @blur="onBlur"
      @focus="onFocus"
    />

    <slot :ui="ui" />

    <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading" :ui="ui">
        <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <UAvatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="leadingAvatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :ui="ui">
        <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </TagsInputRoot>
</template>
