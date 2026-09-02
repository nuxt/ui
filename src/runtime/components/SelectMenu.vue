<script lang="ts">
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/select-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps } from './Avatar.vue'
import type { ButtonProps } from './Button.vue'
import type { ChipProps } from './Chip.vue'
import type { IconProps } from './Icon.vue'
import type { InputProps } from './Input.vue'
import type { LinkPropsKeys } from './Link.vue'
import type { ModelModifiers, ApplyModifiers } from '../types/input'
import type { ButtonHTMLAttributes } from '../types/html'
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetItemValue, GetModelValue, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type SelectMenu = ComponentConfig<typeof theme, AppConfig, 'selectMenu'>

export type SelectMenuValue = AcceptableValue

export type SelectMenuItem = SelectMenuValue | {
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
  ui?: Pick<SelectMenu['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>
  [key: string]: any
}

type ExcludeItem = { type: 'label' | 'separator' }
type IsClearUsed<M extends boolean, C extends boolean | object> = M extends false
  ? (C extends true ? null : C extends object ? null : never)
  : never

export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, C extends boolean | object = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'resetModelValueOnClear' | 'highlightOnHover' | 'by'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /**
   * Whether to display the search input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * Set `autofocus: false` to prevent the search input from being focused when the menu opens (e.g. to avoid opening the virtual keyboard on touch devices).
   * @defaultValue true
   */
  searchInput?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  /**
   * @defaultValue 'primary'
   */
  color?: SelectMenu['variants']['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: SelectMenu['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: SelectMenu['variants']['size']
  required?: boolean
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
   * Display a clear button to reset the model value.
   * Can be an object to pass additional props to the Button.
   * @defaultValue false
   */
  clear?: (C & boolean) | (C & Partial<Omit<ButtonProps, LinkPropsKeys>>)
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
   * `{ rounded: true }`{lang="ts-type"}
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
  /** The value of the SelectMenu when initially rendered. Use when you do not need to control the state of the SelectMenu. */
  defaultValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
  /** The controlled value of the SelectMenu. Can be binded-with with `v-model`. */
  modelValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
  modelModifiers?: Mod
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /** Keep the mobile text size on all breakpoints. */
  fixed?: boolean
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
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: SelectMenu['slots']
}

export interface SelectMenuEmits<
  A extends ArrayOrNested<SelectMenuItem>,
  VK extends GetItemKeys<A> | undefined,
  M extends boolean,
  Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>,
  C extends boolean | object = false
> extends Pick<ComboboxRootEmits, 'update:open'> {
  'change': [event: Event]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'create': [item: string]
  'clear': []
  /** Event handler when highlighted element changes. */
  'highlight': [payload: {
    ref: HTMLElement
    value: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
  } | undefined]
  'update:modelValue': [value: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>]
}

type SlotProps<T extends SelectMenuItem> = (props: { item: T, index: number, ui: SelectMenu['ui'] }) => VNode[]

export interface SelectMenuSlots<
  A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>,
  C extends boolean | object = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'?(props: {
    modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
    open: boolean
    ui: SelectMenu['ui']
  }): VNode[]
  'default'?(props: {
    modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
    open: boolean
    ui: SelectMenu['ui']
  }): VNode[]
  'trailing'?(props: {
    modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>
    open: boolean
    ui: SelectMenu['ui']
  }): VNode[]
  'empty'?(props: { searchTerm: string }): VNode[]
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?(props: { item: T, index: number }): VNode[]
  'item-description'?(props: { item: T, index: number }): VNode[]
  'item-trailing'?: SlotProps<T>
  'content-top'?: (props?: {}) => VNode[]
  'content-bottom'?: (props?: {}) => VNode[]
  'create-item-label'?(props: { item: string }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, C extends boolean | object = false">
import { useTemplateRef, computed, ref, onMounted, onScopeDispose, toRef, toRaw, watch, nextTick } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxCancel, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxVirtualizer, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFieldGroup, FieldGroupReset } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useFilter } from '../composables/useFilter'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { compare, get, getDisplayValue, isArrayOfArray, looseToNumber } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<SelectMenuProps<T, VK, M, Mod, C>>(), {
  portal: true,
  searchInput: true,
  labelKey: 'label',
  descriptionKey: 'description',
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
  resetModelValueOnClear: true,
  autofocusDelay: 0,
  virtualize: false
})
const emits = defineEmits<SelectMenuEmits<T, VK, M, Mod, C>>()
const slots = defineSlots<SelectMenuSlots<T, VK, M, Mod, C>>()

const props = useComponentProps<SelectMenuProps<T, VK, M, Mod, C>>('selectMenu', _props)

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as SelectMenu['AppConfig']
const { filterGroups } = useFilter()
const rootProps = useForwardProps(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple', 'resetSearchTermOnBlur', 'resetSearchTermOnSelect', 'resetModelValueOnClear', 'highlightOnHover', 'by'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => defu(props.arrow, { rounded: true }) as ComboboxArrowProps)
const clearProps = computed(() => typeof props.clear === 'object' ? props.clear : {} as Partial<Omit<ButtonProps, LinkPropsKeys>>)

const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, size.value ?? 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})
const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t('selectMenu.search'), variant: 'none', fixed: props.fixed }) as Omit<InputProps, 'modelValue' | 'defaultValue'>)

const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formFieldSize, color: formFieldColor, id, name, highlight: formFieldHighlight, disabled: formFieldDisabled, ariaAttrs } = useFormField<InputProps>(_props)

const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(_props)
// Pass only the props the composable reads: `defu(props, ...)` copied every prop
// through the `useComponentProps` proxy and subscribed this computed (and `ui`,
// which reads `isLeading`/`isTrailing`) to all of them, re-running the whole tv
// pipeline on unrelated prop changes.
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(computed(() => ({
  icon: props.icon,
  leading: props.leading,
  leadingIcon: props.leadingIcon,
  trailing: props.trailing,
  trailingIcon: props.trailingIcon ?? appConfig.ui.icons.chevronDown,
  loading: props.loading,
  loadingIcon: props.loadingIcon
})))

// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color)
// eslint-disable-next-line vue/no-dupe-keys
const highlight = computed(() => formFieldHighlight.value ?? props.highlight)
// eslint-disable-next-line vue/no-dupe-keys
const size = computed(() => fieldGroupSize.value ?? formFieldSize.value ?? props.size)

const disabled = computed(() => formFieldDisabled.value ?? props.disabled)

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: SelectMenuItem, index: number }>({
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

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.selectMenu || {}) })({
  color: color.value,
  variant: props.variant,
  size: size.value,
  loading: props.loading,
  highlight: highlight.value,
  fixed: props.fixed,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value,
  virtualize: !!props.virtualize,
  multiple: props.multiple
}))

function displayValue(value: GetItemValue<T, VK, ExcludeItem> | GetItemValue<T, VK, ExcludeItem>[]): string | undefined {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value
      .map(item => getDisplayValue<T[], GetItemValue<T, VK, ExcludeItem>>(items.value, item, {
        labelKey: props.labelKey,
        valueKey: props.valueKey,
        by: props.by
      }))
      .filter((v): v is string => v != null && v !== '')

    return displayedValues.length > 0 ? displayedValues.join(', ') : undefined
  }

  return getDisplayValue<T[], GetItemValue<T, VK, ExcludeItem>>(items.value, value as GetItemValue<T, VK, ExcludeItem>, {
    labelKey: props.labelKey,
    valueKey: props.valueKey,
    by: props.by
  })
}

const groups = computed<SelectMenuItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value
  }

  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: (item: SelectMenuItem) => isSelectItem(item) && !!item.type && ['label', 'separator'].includes(item.type)
  })
})
const filteredItems = computed(() => filteredGroups.value.flatMap(group => group))

// Keys each rendered item by where it sits in the *unfiltered* items, so the key follows the
// item as filtering re-sorts the list. A positional key over `filteredGroups` makes Vue reuse
// the same `ComboboxItem` instance and rewrite its text, and reka's item id lives on that
// instance — so `aria-activedescendant` keeps pointing at an id that never changes and a
// screen reader is never told the active option moved.
//
// `filterGroups` drops groups that filter away entirely, so `filteredGroups` indices do not
// align with `groups` and the group key has to come from an item too. Identical primitives
// cannot be told apart by value, so each occurrence takes one of that value's original
// positions in turn, which keeps the keys unique.
const keyedGroups = computed(() => {
  const positions = new Map<SelectMenuItem, string[]>()

  groups.value.forEach((group, groupIndex) => {
    group.forEach((item, index) => {
      const key = `item-${groupIndex}-${index}`
      const queue = positions.get(item)

      if (queue) {
        queue.push(key)
      } else {
        positions.set(item, [key])
      }
    })
  })

  return filteredGroups.value.map((group, groupIndex) => {
    const entries = group.map((item, index) => ({
      item,
      key: positions.get(item)?.shift() ?? `filtered-${groupIndex}-${index}`
    }))

    return { key: entries[0]?.key ?? `filtered-${groupIndex}`, entries }
  })
})

// eslint-disable-next-line vue/no-dupe-keys
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

const triggerRef = useTemplateRef('triggerRef')

function autoFocus() {
  if (props.autofocus) {
    triggerRef.value?.$el?.focus({
      focusVisible: true
    })
  }
}

let autofocusTimeoutId: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  autofocusTimeoutId = setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

onScopeDispose(() => clearTimeout(autofocusTimeoutId))

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
  }

  if (props.modelModifiers?.trim && (typeof value === 'string' || value === null || value === undefined)) {
    value = value?.trim() ?? null
  }

  if (props.modelModifiers?.number) {
    value = looseToNumber(value)
  }

  if (props.modelModifiers?.nullable) {
    value ??= null
  }

  if (props.modelModifiers?.optional && !props.modelModifiers?.nullable && value !== null) {
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

const isOpen = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | undefined

onScopeDispose(() => clearTimeout(timeoutId))

function onUpdateOpen(value: boolean) {
  isOpen.value = value

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

function onCreate(e: Event) {
  e.preventDefault()
  e.stopPropagation()

  emits('create', searchTerm.value)
}

function onSelect(e: Event, item: SelectMenuItem) {
  if (!isSelectItem(item)) {
    return
  }

  if (item.disabled) {
    e.preventDefault()
    return
  }

  item.onSelect?.(e)
}

function isSelectItem(item: SelectMenuItem): item is Exclude<SelectMenuItem, SelectMenuValue> {
  return typeof item === 'object' && item !== null
}

function isModelValueEmpty(modelValue: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>): boolean {
  if (props.multiple && Array.isArray(modelValue)) {
    return modelValue.length === 0
  }
  return modelValue === undefined || modelValue === null || modelValue === ''
}

function onClear() {
  emits('clear')
}

function onMountAutoFocus(event: Event) {
  // Prevent the `FocusScope` from focusing the search input on open when its autofocus is disabled.
  if (searchInputProps.value.autofocus === false) {
    event.preventDefault()
  }
}

const viewportRef = useTemplateRef('viewportRef')

const comboboxRootRef = useTemplateRef('comboboxRootRef')

// reka-ui only re-highlights the first item when the list goes from empty to non-empty.
// With `create-item`, the create item is always registered so the count never drops to 0,
// leaving the highlight stale when async `items` load. Re-highlight when items change while open.
// Scoped to `create-item` only, otherwise this fires on infinite-scroll appends too and
// scrolls the viewport back to the top.
// Wait an extra tick so freshly mounted items are registered in reka-ui's collection before highlighting.
watch(() => props.items, async () => {
  if (!isOpen.value || !props.createItem) {
    return
  }

  await nextTick()
  comboboxRootRef.value?.highlightFirstItem?.()
}, { flush: 'post' })

defineExpose({
  triggerRef: toRef(() => triggerRef.value?.$el as HTMLButtonElement),
  viewportRef: toRef(() => viewportRef.value)
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <ComboboxItem
      data-slot="item"
      :class="ui.item({ class: props.ui?.item })"
      :value="searchTerm"
      @select="onCreate"
    >
      <span data-slot="itemLabel" :class="ui.itemLabel({ class: props.ui?.itemLabel })">
        <slot name="create-item-label" :item="searchTerm">
          {{ t('selectMenu.create', { label: searchTerm }) }}
        </slot>
      </span>
    </ComboboxItem>
  </DefineCreateItemTemplate>

  <DefineItemTemplate v-slot="{ item, index }">
    <ComboboxLabel v-if="isSelectItem(item) && item.type === 'label'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey as string) }}
    </ComboboxLabel>

    <ComboboxSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

    <ComboboxItem
      v-else
      data-slot="item"
      :class="ui.item({ class: [props.ui?.item, isSelectItem(item) && item.ui?.item, isSelectItem(item) && item.class] })"
      :disabled="isSelectItem(item) && item.disabled"
      :value="props.valueKey && isSelectItem(item) ? get(item, props.valueKey as string) : item"
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
        <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
          <UIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <UAvatar v-else-if="isSelectItem(item) && item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <UChip
            v-else-if="isSelectItem(item) && item.chip"
            :size="((item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
            inset
            standalone
            v-bind="item.chip"
            data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
          />
        </slot>

        <span data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, isSelectItem(item) && item.ui?.itemWrapper] })">
          <span data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, isSelectItem(item) && item.ui?.itemLabel] })">
            <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
              {{ isSelectItem(item) ? get(item, props.labelKey as string) : item }}
            </slot>
          </span>

          <span v-if="isSelectItem(item) && (get(item, props.descriptionKey as string) || !!slots['item-description'])" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, isSelectItem(item) && item.ui?.itemDescription] })">
            <slot name="item-description" :item="(item as NestedItem<T>)" :index="index">
              {{ get(item, props.descriptionKey as string) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, isSelectItem(item) && item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" :ui="ui" />

          <ComboboxItemIndicator as-child>
            <UIcon :name="props.selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
          </ComboboxItemIndicator>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot
    ref="comboboxRootRef"
    v-slot="{ modelValue, open }"
    v-bind="(rootProps as any)"
    ignore-filter
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger
        :id="id"
        ref="triggerRef"
        data-slot="base"
        :class="ui.base({ class: [props.ui?.base, props.class] })"
        tabindex="0"
        v-bind="{ ...$attrs, ...ariaAttrs }"
      >
        <span v-if="isLeading || !!props.avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="(modelValue as ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>)" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <UAvatar v-else-if="!!props.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="props.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="(modelValue as ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>)" :open="open" :ui="ui">
          <template v-for="displayedModelValue in [displayValue(modelValue as any)]" :key="displayedModelValue">
            <span v-if="displayedModelValue !== undefined && displayedModelValue !== null" data-slot="value" :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else data-slot="placeholder" :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ props.placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing || !!props.clear" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="(modelValue as ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>)" :open="open" :ui="ui">
            <ComboboxCancel v-if="!!props.clear && !isModelValueEmpty(modelValue as ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>)" as-child>
              <UButton
                as="span"
                :icon="props.clearIcon || appConfig.ui.icons.close"
                :size="size"
                variant="link"
                color="neutral"
                tabindex="-1"
                v-bind="clearProps"
                data-slot="trailingClear"
                :class="ui.trailingClear({ class: props.ui?.trailingClear })"
                @click.stop="onClear"
              />
            </ComboboxCancel>

            <UIcon v-else-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <FieldGroupReset>
        <ComboboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
          <FocusScope trapped data-slot="focusScope" :class="ui.focusScope({ class: props.ui?.focusScope })" @mount-auto-focus="onMountAutoFocus">
            <slot name="content-top" />

            <ComboboxInput v-if="!!props.searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
              <UInput
                autofocus
                autocomplete="off"
                :size="size"
                v-bind="searchInputProps"
                :model-modifiers="{
                  trim: props.modelModifiers?.trim
                }"
                data-slot="input"
                :class="ui.input({ class: props.ui?.input })"
                @change.stop
              />
            </ComboboxInput>

            <ComboboxEmpty data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
              <slot name="empty" :search-term="searchTerm">
                {{ searchTerm ? t('selectMenu.noMatch', { searchTerm }) : t('selectMenu.noData') }}
              </slot>
            </ComboboxEmpty>

            <div ref="viewportRef" role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
              <template v-if="!!props.virtualize">
                <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

                <ComboboxVirtualizer
                  v-slot="{ option: item, virtualItem }"
                  :options="(filteredItems as any[])"
                  :text-content="item => isSelectItem(item) ? get(item, props.labelKey as string) : String(item)"
                  v-bind="virtualizerProps"
                >
                  <ReuseItemTemplate :item="item" :index="virtualItem.index" />
                </ComboboxVirtualizer>

                <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
              </template>

              <template v-else>
                <ComboboxGroup v-if="createItem && createItemPosition === 'top'" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                  <ReuseCreateItemTemplate />
                </ComboboxGroup>

                <ComboboxGroup v-for="group in keyedGroups" :key="group.key" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                  <ReuseItemTemplate v-for="(entry, index) in group.entries" :key="entry.key" :item="entry.item" :index="index" />
                </ComboboxGroup>

                <ComboboxGroup v-if="createItem && createItemPosition === 'bottom'" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                  <ReuseCreateItemTemplate />
                </ComboboxGroup>
              </template>
            </div>

            <slot name="content-bottom" />
          </FocusScope>

          <ComboboxArrow v-if="!!props.arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
        </ComboboxContent>
      </FieldGroupReset>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
