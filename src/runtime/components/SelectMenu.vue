<script lang="ts">
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/select-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import type { AvatarProps, ChipProps, IconProps, InputProps } from '../types'
import type { ButtonHTMLAttributes } from '../types/html'
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetItemValue, GetModelValue, GetModelValueEmits, NestedItem, EmitsToProps } from '../types/utils'
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

export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'highlightOnHover'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /**
   * Whether to display the search input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * @defaultValue true
   */
  searchInput?: boolean | InputProps
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
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
   */
  content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   * @IconifyIcon
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
     * Estimated size (in px) of each item
     * @defaultValue 32
     */
    estimateSize?: number
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
  defaultValue?: GetModelValue<T, VK, M>
  /** The controlled value of the SelectMenu. Can be binded-with with `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
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
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: SelectMenu['slots']
}

export type SelectMenuEmits<A extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
  change: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  create: [item: string]
  /** Event handler when highlighted element changes. */
  highlight: [payload: {
    ref: HTMLElement
    value: GetModelValue<A, VK, M>
  } | undefined]
} & GetModelValueEmits<A, VK, M>

type SlotProps<T extends SelectMenuItem> = (props: { item: T, index: number, ui: SelectMenu['ui'] }) => any

export interface SelectMenuSlots<
  A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: SelectMenu['ui'] }): any
  'default'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: SelectMenu['ui'] }): any
  'trailing'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: SelectMenu['ui'] }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label'(props: { item: T, index: number }): any
  'item-description'(props: { item: T, index: number }): any
  'item-trailing': SlotProps<T>
  'content-top': (props?: {}) => any
  'content-bottom': (props?: {}) => any
  'create-item-label'(props: { item: string }): any
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
import { useTemplateRef, computed, onMounted, toRef, toRaw } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxVirtualizer, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope, useForwardPropsEmits, useFilter } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFieldGroup } from '../composables/useFieldGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { usePortal } from '../composables/usePortal'
import { compare, get, getDisplayValue, isArrayOfArray } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectMenuProps<T, VK, M>>(), {
  portal: true,
  searchInput: true,
  labelKey: 'label',
  descriptionKey: 'description',
  resetSearchTermOnBlur: true,
  resetSearchTermOnSelect: true,
  autofocusDelay: 0,
  virtualize: false
})
const emits = defineEmits<SelectMenuEmits<T, VK, M>>()
const slots = defineSlots<SelectMenuSlots<T, VK, M>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as SelectMenu['AppConfig']
const { contains } = useFilter({ sensitivity: 'base' })

const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple', 'resetSearchTermOnBlur', 'resetSearchTermOnSelect', 'highlightOnHover'), emits)
const portalProps = usePortal(toRef(() => props.portal))
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)
const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(items.value, props.size || 'md', props.descriptionKey as string)
  })
})
const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t('selectMenu.search'), variant: 'none' }) as InputProps)

const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputProps>(props)
const { orientation, size: fieldGroupSize } = useFieldGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => fieldGroupSize.value || formGroupSize.value)

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

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.selectMenu || {}) })({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  fieldGroup: orientation.value,
  virtualize: !!props.virtualize
}))

function displayValue(value: GetItemValue<T, VK> | GetItemValue<T, VK>[]): string | undefined {
  if (props.multiple && Array.isArray(value)) {
    const displayedValues = value
      .map(item => getDisplayValue<T[], GetItemValue<T, VK>>(items.value, item, {
        labelKey: props.labelKey,
        valueKey: props.valueKey
      }))
      .filter((v): v is string => v != null && v !== '')

    return displayedValues.length > 0 ? displayedValues.join(', ') : undefined
  }

  return getDisplayValue<T[], GetItemValue<T, VK>>(items.value, value as GetItemValue<T, VK>, {
    labelKey: props.labelKey,
    valueKey: props.valueKey
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
    !isSelectItem(item) || (!item.type || !['label', 'separator'].includes(item.type))
  ).length > 0)
})
const filteredItems = computed(() => filteredGroups.value.flatMap(group => group))

const createItem = computed(() => {
  if (!props.createItem || !searchTerm.value) {
    return false
  }

  const newItem = props.valueKey ? { [props.valueKey]: searchTerm.value } as NestedItem<T> : searchTerm.value

  if ((typeof props.createItem === 'object' && props.createItem.when === 'always') || props.createItem === 'always') {
    return !filteredItems.value.find(item => compare(item, newItem, props.valueKey as string))
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

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})

function onUpdate(value: any) {
  if (toRaw(props.modelValue) === value) {
    return
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

defineExpose({
  triggerRef: toRef(() => triggerRef.value?.$el as HTMLButtonElement)
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
            :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
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
            <UIcon :name="selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, isSelectItem(item) && item.ui?.itemTrailingIcon] })" />
          </ComboboxItemIndicator>
        </span>
      </slot>
    </ComboboxItem>
  </DefineItemTemplate>

  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    ignore-filter
    as-child
    :name="name"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger ref="triggerRef" data-slot="base" :class="ui.base({ class: [props.ui?.base, props.class] })" tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" data-slot="leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" data-slot="leadingIcon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
          <template v-for="displayedModelValue in [displayValue(modelValue as GetModelValue<T, VK, M>)]" :key="displayedModelValue">
            <span v-if="displayedModelValue !== undefined && displayedModelValue !== null" data-slot="value" :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else data-slot="placeholder" :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <UIcon v-if="trailingIconName" :name="trailingIconName" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal v-bind="portalProps">
      <ComboboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <FocusScope trapped data-slot="focusScope" :class="ui.focusScope({ class: props.ui?.focusScope })">
          <slot name="content-top" />

          <ComboboxInput v-if="!!searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
            <UInput
              autofocus
              autocomplete="off"
              :size="size"
              v-bind="searchInputProps"
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

          <div role="presentation" data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })">
            <template v-if="!!virtualize">
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

              <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
              </ComboboxGroup>

              <ComboboxGroup v-if="createItem && createItemPosition === 'bottom'" data-slot="group" :class="ui.group({ class: props.ui?.group })">
                <ReuseCreateItemTemplate />
              </ComboboxGroup>
            </template>
          </div>

          <slot name="content-bottom" />
        </FocusScope>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
