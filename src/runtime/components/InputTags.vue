<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { TagsInputRootProps, TagsInputRootEmits, AcceptableInputValue } from 'reka-ui'
import theme from '#build/ui/input-tags'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type InputTags = ComponentConfig<typeof theme, AppConfig, 'inputTags'>

export type InputTagItem = AcceptableInputValue

export interface InputTagsProps<T extends InputTagItem = InputTagItem> extends Pick<TagsInputRootProps<T>, 'modelValue' | 'defaultValue' | 'addOnPaste' | 'addOnTab' | 'addOnBlur' | 'duplicate' | 'disabled' | 'delimiter' | 'max' | 'id' | 'convertValue' | 'displayValue' | 'name' | 'required'>, UseComponentIconsProps {
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
  deleteIcon?: string
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

type SlotProps<T extends InputTagItem> = (props: { item: T, index: number }) => any

export interface InputTagsSlots<T extends InputTagItem = InputTagItem> {
  'leading'(props?: {}): any
  'default'(props?: {}): any
  'trailing'(props?: {}): any
  'item-text': SlotProps<T>
  'item-delete': SlotProps<T>
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
const { orientation, size: buttonGroupSize } = useButtonGroup<InputTagsProps>(props)
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

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

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
  inputRef
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <TagsInputRoot
    :id="id"
    v-slot="{ modelValue: tags }"
    :model-value="modelValue"
    :default-value="defaultValue"
    :class="ui.root({ class: [ui.base({ class: props.ui?.base }), props.ui?.root, props.class] })"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
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
        <slot v-if="!!slots['item-text']" name="item-text" :item="(item as T)" :index="index" />
      </TagsInputItemText>

      <TagsInputItemDelete
        :class="ui.itemDelete({ class: [props.ui?.itemDelete] })"
        :disabled="disabled"
      >
        <slot name="item-delete" :item="(item as T)" :index="index">
          <UIcon :name="deleteIcon || appConfig.ui.icons.close" :class="ui.itemDeleteIcon({ class: [props.ui?.itemDeleteIcon] })" />
        </slot>
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      ref="inputRef"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      :placeholder="placeholder"
      :max-length="maxLength"
      :class="ui.input({ class: props.ui?.input })"
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
  </TagsInputRoot>
</template>
