<script lang="ts">
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/input-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ButtonProps, ChipProps, IconProps, InputProps, LinkPropsKeys } from '../types'
import type { ModelModifiers } from '../types/input'
import type { InputHTMLAttributes } from '../types/html'
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetItemValue, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type InputMenu = ComponentConfig<typeof theme, AppConfig, 'inputMenu'>

export type InputMenuValue = AcceptableValue

export type InputMenuItem = InputMenuValue | {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  disabled?: boolean
  onSelect?: (e: Event) => void
  class?: any
  ui?: Pick<InputMenu['slots'], 'tagsItem' | 'tagsItemText' | 'tagsItemDelete' | 'tagsItemDeleteIcon' | 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface InputMenuProps<T extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'resetModelValueOnClear' | 'highlightOnHover' | 'openOnClick' | 'openOnFocus' | 'by'>, UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'disabled' | 'name' | 'type' | 'placeholder' | 'autofocus' | 'maxlength' | 'minlength' | 'pattern' | 'size' | 'min' | 'max' | 'step'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  type?: InputHTMLAttributes['type']
  /** The placeholder text when the input is empty. */
  placeholder?: string
  /**
   * @defaultValue 'primary'
   */
  color?: InputMenu['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: InputMenu['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: InputMenu['variants']['size']
  required?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * The icon displayed to delete a tag.
   * Works only when `multiple` is `true`.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  deleteIcon?: IconProps['name']
  /**
   * Display a clear button to reset the model value.
   * Can be an object to pass additional props to the Button.
   * @defaultValue false
   */
  clear?: boolean | Partial<Omit<ButtonProps, LinkPropsKeys>>
  /**
   * The icon displayed in the clear button.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  clearIcon?: IconProps['name']
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean | string | HTMLElement
  /**
   * Enable virtualization for large lists.
   * Note: when enabled, all groups are flattened into a single list due to a limitation of Reka UI (https://github.com/unovue/reka-ui/issues/1885).
   * @defaultValue false
   */
  virtualize?: boolean | {
    /**
     * Number of items rendered outside the visible area
     * @defaultValue 12
     */
    overscan?: number
    /**
     * Estimated size (in px) of each item, or a function that returns the size for a given index
     * @defaultValue 32
     */
    estimateSize?: number | ((index: number) => number)
  }
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * When `items` is an array of objects, select the field to use as the description.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  items?: T
  /** The value of the InputMenu when initially rendered. Use when you do not need to control the state of the InputMenu. */
  defaultValue?: GetModelValue<T, VK, M>
  /** The controlled value of the InputMenu. Can be binded-with with `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  modelModifiers?: Omit<ModelModifiers<GetModelValue<T, VK, M>>, 'lazy'>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Determines if custom user input that does not exist in options can be added.
   * @defaultValue false
   */
  createItem?: boolean | 'always' | { position?: 'top' | 'bottom', when?: 'empty' | 'always' }
  /**
   * Fields to filter items by.
   * @defaultValue [labelKey]
   */
  filterFields?: string[]
  /**
   * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  class?: any
  ui?: InputMenu['slots']
}

export type InputMenuEmits<A extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'create': [item: string]
  'clear': []
  /** Event handler when highlighted element changes. */
  'highlight': [payload: {
    ref: HTMLElement
    value: GetModelValue<A, VK, M>
  } | undefined]
  'remove-tag': [item: GetModelValue<A, VK, M>]
} & GetModelValueEmits<A, VK, M>

type SlotProps<T extends InputMenuItem> = (props: { item: T, index: number, ui: InputMenu['ui'] }) => any

export interface InputMenuSlots<
  A extends ArrayOrNested<InputMenuItem> = ArrayOrNested<InputMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: InputMenu['ui'] }): any
  'trailing'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: InputMenu['ui'] }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label'(props: { item: T, index: number }): any
  'item-description'(props: { item: T, index: number }): any
  'item-trailing': SlotProps<T>
  'tags-item-text'(props: { item: T, index: number }): any
  'tags-item-delete': SlotProps<T>
  'content-top': (props?: {}) => any
  'content-bottom': (props?: {}) => any
  'create-item-label'(props: { item: string }): any
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<InputMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
import { computed, useTemplateRef, toRef, onMounted, toRaw, nextTick } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxCancel, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxVirtualizer, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, TagsInputRoot, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput, useForwardPropsEmits, useFilter } from 'reka-ui'
import { defu } from 'defu'
import { isEqual } from 'ohash/utils'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../composables/useComponentUI'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { compare, get, getDisplayValue, isArrayOfArray, looseToNumber } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputMenuProps<T, VK, M>>(), {
  type: 'text',
  autofocusDelay: 0,
  portal: true,
  labelKey: 'label',
  descriptionKey: 'description',
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
  resetModelValueOnClear: true,
  virtualize: false
})
const emits = defineEmits<InputMenuEmits<T, VK, M>>()
const slots = defineSlots<InputMenuSlots<T, VK, M>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as InputMenu['AppConfig']
const uiProp = useComponentUI('inputMenu', props)
const { contains } = useFilter({ sensitivity: 'base' })

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple', 'resetSearchTermOnBlur', 'resetSearchTermOnSelect', 'resetModelValueOnClear', 'highlightOnHover', 'openOnClick', 'openOnFocus', 'by'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)
const clearProps = computed(() => typeof props.clear === 'object' ? props.clear : {} as Partial<Omit<ButtonProps, LinkPropsKeys>>)
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, inputSize.value || 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})

const { emitFormBlur, emitFormFocus, emitFormChange, emitFormInput, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const inputSize = computed(() => fieldGroupSize.value || formGroupSize.value)

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: InputMenuItem, index: number }>({
  props: {
    item: {
      type: [Object, String, Number, Boolean],
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.inputMenu || {}) })({
  color: color.value,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  multiple: props.multiple,
  fieldGroup: orientation.value,
  virtualize: !!props.virtualize
}))

// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

function displayValue(value: GetItemValue<T, VK>): string {
  return getDisplayValue<T[], GetItemValue<T, VK>>(items.value, value, {
    labelKey: props.labelKey,
    valueKey: props.valueKey,
    by: props.by
  }) ?? ''
}

const groups = computed<InputMenuItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value
  }

  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

  return groups.value.map(items => items.filter((item) => {
    if (item === undefined || item === null) {
      return false
    }

    if (typeof item !== 'object') {
      return contains(String(item), searchTerm.value)
    }

    if (item.type && ['label', 'separator'].includes(item.type)) {
      return true
    }

    return fields.some((field) => {
      const value = get(item, field)
      return value !== undefined && value !== null && contains(String(value), searchTerm.value)
    })
  })).filter(group => group.filter(item =>
    !isInputItem(item) || (!item.type || !['label', 'separator'].includes(item.type))
  ).length > 0)
})
const filteredItems = computed(() => filteredGroups.value.flatMap(group => group))

const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false
  }

  const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } as NestedItem<T> : searchTerm.value

  if ((typeof props.createItem === 'object' && props.createItem.when === 'always') || props.createItem === 'always') {
    return !filteredItems.value.find(item => compare(item, newItem, (props.by ?? props.valueKey) as string | undefined))
  }

  return !filteredItems.value.length
})
const createItemPosition = computed(() => typeof props.createItem === 'object' ? props.createItem.position : 'bottom')

const inputRef = useTemplateRef('inputRef')

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.$el?.focus()
  }
}

onMounted(() => {
  nextTick(() => {
    searchTerm.value = ''
  })

  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
  }

  if (props.modelModifiers?.trim) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number) {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullable) {
    value ??= null
  }

  if (props.modelModifiers?.optional) {
    value ??= undefined
  }

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()

  if (props.resetSearchTermOnSelect) {
    searchTerm.value = ''
  }
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
  emitFormBlur()
}

function onFocus(event: FocusEvent) {
  emits('focus', event)
  emitFormFocus()
}

function onUpdateOpen(value: boolean) {
  let timeoutId

  if (!value) {
    const event = new FocusEvent('blur')

    emits('blur', event)
    emitFormBlur()

    // Since we use `displayValue` prop inside ComboboxInput we should reset searchTerm manually
    // https://reka-ui.com/docs/components/combobox#api-reference
    if (props.resetSearchTermOnBlur) {
      const STATE_ANIMATION_DELAY_MS = 100

      timeoutId = setTimeout(() => {
        searchTerm.value = ''
      }, STATE_ANIMATION_DELAY_MS)
    }
  } else {
    const event = new FocusEvent('focus')
    emits('focus', event)
    emitFormFocus()
    clearTimeout(timeoutId)
  }
}

function onRemoveTag(event: any, modelValue: GetModelValue<T, VK, true>) {
  if (props.multiple) {
    const filteredValue = modelValue.filter(value => !isEqual(value, event))
    emits('update:modelValue', filteredValue as GetModelValue<T, VK, M>)
    emits('remove-tag', event)
    onUpdate(filteredValue)
  }
}

function onCreate(e: Event) {
  e.preventDefault()
  e.stopPropagation()

  emits('create', searchTerm.value)
}

function onSelect(e: Event, item: InputMenuItem) {
  if (!isInputItem(item)) {
    return
  }

  if (item.disabled) {
    e.preventDefault()
    return
  }

  item.onSelect?.(e)
}

function isInputItem(item: InputMenuItem): item is Exclude<InputMenuItem, InputMenuValue> {
  return typeof item === 'object' && item !== null
}

function isModelValueEmpty(modelValue: GetModelValue<T, VK, M>): boolean {
  if (props.multiple && Array.isArray(modelValue)) {
    return modelValue.length === 0
  }
  return modelValue === undefined || modelValue === null || modelValue === ''
}

function onClear() {
  emits('clear')
}

const viewportRef = useTemplateRef('viewportRef')

defineExpose({
  inputRef: toRef(() => inputRef.value?.$el as HTMLInputElement),
  viewportRef: toRef(() => viewportRef.value)
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <ComboboxItem
      data-slot="item"
      :class="ui.item({ class: uiProp?.item })"
      :value="searchTerm"
      @select="onCreate"
    >
      <span data-slot="itemLabel" :class="ui.itemLabel({ class: uiProp?.itemLabel })">
        <slot name="create-item-label" :item="searchTerm">
          {{ t('inputMenu.create', { label: searchTerm }) }}
        </slot>
      </span>
    </ComboboxItem>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <ComboboxLabel v-if="isInputItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [uiProp?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey as string) }}
    </ComboboxLabel>

    <ComboboxSeparator v-else-if="isInputItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [uiProp?.separator, item.ui?.separator, item.class] })" />

    <ComboboxItem
      v-else
      data-slot="item"
      :class="ui.item({ class: [uiProp?.item, isInputItem(item) && item.ui?.item, isInputItem(item) && item.class] })"
      :disabled="isInputItem(item) && item.disabled"
      :value="props.valueKey && isInputItem(item) ? get(item, props.valueKey as string) : item"
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
        <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
          <UIcon v-if="isInputItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [uiProp?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <UAvatar v-else-if="isInputItem(item) && item.avatar" :size="((item.ui?.itemLeadingAvatarSize || uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [uiProp?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <UChip
            v-else-if="isInputItem(item) && item.chip"
            :size="((item.ui?.itemLeadingChipSize || uiProp?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
            inset
            standalone
            v-bind="item.chip"
            data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [uiProp?.itemLeadingChip, item.ui?.itemLeadingChip] })"
          />
        </slot>

        <span data-slot="itemWrapper" :class="ui.itemWrapper({ class: [uiProp?.itemWrapper, isInputItem(item) && item.ui?.itemWrapper] })">
          <span data-slot="itemLabel" :class="ui.itemLabel({ class: [uiProp?.itemLabel, isInputItem(item) && item.ui?.itemLabel] })">
            <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
              {{ isInputItem(item) ? get(item, props.labelKey as string) : item }}
            </slot>
          </span>

          <span v-if="isInputItem(item) && (get(item, props.descriptionKey as string) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [uiProp?.itemDescription, isInputItem(item) && item.ui?.itemDescription] })">
            <slot name="item-description" :item="(item as NestedItem<T>)" :index="index">
              {{ get(item, props.descriptionKey as string) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [uiProp?.itemTrailing, isInputItem(item) && item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" :ui="ui" />

          <ComboboxItemIndicator as-child>
            <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [uiProp?.itemTrailingIcon, isInputItem(item) && item.ui?.itemTrailingIcon] })" />
          </ComboboxItemIndicator>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :disabled="disabled"
    data-slot="root"
    :class="ui.root({ class: [uiProp?.root, props.class] })"
    :as-child="!!multiple"
    ignore-filter
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor :as-child="!multiple" data-slot="base" :class="ui.base({ class: uiProp?.base })">
      <TagsInputRoot
        v-if="multiple"
        v-slot="{ modelValue: tags }"
        :model-value="(modelValue as string[])"
        :disabled="disabled"
        :required="required"
        delimiter=""
        as-child
        @blur="onBlur"
        @focus="onFocus"
        @remove-tag="onRemoveTag($event, modelValue as GetModelValue<T, VK, true>)"
      >
        <TagsInputItem v-for="(item, index) in tags" :key="index" :value="item" data-slot="tagsItem" :class="ui.tagsItem({ class: [uiProp?.tagsItem, isInputItem(item) && item.ui?.tagsItem] })">
          <TagsInputItemText data-slot="tagsItemText" :class="ui.tagsItemText({ class: [uiProp?.tagsItemText, isInputItem(item) && item.ui?.tagsItemText] })">
            <slot name="tags-item-text" :item="(item as NestedItem<T>)" :index="index">
              {{ displayValue(item as GetItemValue<T, VK>) }}
            </slot>
          </TagsInputItemText>

          <TagsInputItemDelete data-slot="tagsItemDelete" :class="ui.tagsItemDelete({ class: [uiProp?.tagsItemDelete, isInputItem(item) && item.ui?.tagsItemDelete] })" :disabled="disabled">
            <slot name="tags-item-delete" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
              <UIcon :name="deleteIcon || appConfig.ui.icons.close" data-slot="tagsItemDeleteIcon" :class="ui.tagsItemDeleteIcon({ class: [uiProp?.tagsItemDeleteIcon, isInputItem(item) && item.ui?.tagsItemDeleteIcon] })" />
            </slot>
          </TagsInputItemDelete>
        </TagsInputItem>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput
            :id="id"
            ref="inputRef"
            v-bind="{ ...$attrs, ...ariaAttrs }"
            :placeholder="placeholder"
            data-slot="tagsInput"
            :class="ui.tagsInput({ class: uiProp?.tagsInput })"
            @change.stop
          />
        </ComboboxInput>
      </TagsInputRoot>

      <ComboboxInput
        v-else
        :id="id"
        ref="inputRef"
        :display-value="displayValue"
        v-bind="{ ...$attrs, ...ariaAttrs }"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        @blur="onBlur"
        @focus="onFocus"
        @change.stop
        @update:model-value="searchTerm = $event"
      />

      <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: uiProp?.leading })">
        <slot name="leading" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: uiProp?.leadingIcon })" />
          <UAvatar v-else-if="!!avatar" :size="((uiProp?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: uiProp?.itemLeadingAvatar })" />
        </slot>
      </span>

      <ComboboxTrigger v-if="isTrailing || !!slots.trailing || !!clear" data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
        <slot name="trailing" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <ComboboxCancel v-if="!!clear && !isModelValueEmpty(modelValue as GetModelValue<T, VK, M>)" as-child>
            <UButton
              as="span"
              :icon="clearIcon || appConfig.ui.icons.close"
              :size="inputSize"
              variant="link"
              color="neutral"
              tabindex="-1"
              v-bind="clearProps"
              data-slot="trailingClear"
              :class="ui.trailingClear({ class: uiProp?.trailingClear })"
              @click.stop="onClear"
            />
          </ComboboxCancel>

          <UIcon v-else-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent data-slot="content" :class="ui.content({ class: uiProp?.content })" v-bind="contentProps" @focus-outside.prevent>
        <slot name="content-top" />

        <ComboboxEmpty data-slot="empty" :class="ui.empty({ class: uiProp?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? t('inputMenu.noMatch', { searchTerm }) : t('inputMenu.noData') }}
          </slot>
        </ComboboxEmpty>

        <div ref="viewportRef" role="presentation" data-slot="viewport" :class="ui.viewport({ class: uiProp?.viewport })">
          <template v-if="!!virtualize">
            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

            <ComboboxVirtualizer
              v-slot="{ option: item, virtualItem }"
              :options="(filteredItems as any[])"
              :text-content="item => isInputItem(item) ? get(item, props.labelKey as string) : String(item)"
              v-bind="virtualizerProps"
            >
              <ReuseItemTemplate :item="item" :index="virtualItem.index" />
            </ComboboxVirtualizer>

            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
          </template>

          <template v-else>
            <ComboboxGroup v-if="createItem && createItemPosition === 'top'" data-slot="group" :class="ui.group({ class: uiProp?.group })">
              <ReuseCreateItemTemplate />
            </ComboboxGroup>

            <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: uiProp?.group })">
              <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
            </ComboboxGroup>

            <ComboboxGroup v-if="createItem && createItemPosition === 'bottom'" data-slot="group" :class="ui.group({ class: uiProp?.group })">
              <ReuseCreateItemTemplate />
            </ComboboxGroup>
          </template>
        </div>

        <slot name="content-bottom" />

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: uiProp?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
