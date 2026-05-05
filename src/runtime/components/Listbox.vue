<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { VNode } from 'vue'
import { computed, toRaw, toRef } from 'vue'
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/listbox'
import type { AvatarProps, ChipProps, IconProps, InputProps } from '../types'
import type { ModelModifiers, ApplyModifiers } from '../types/input'
import type { ArrayOrNested, GetItemKeys, GetModelValue, NestedItem } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Listbox = ComponentConfig<typeof theme, AppConfig, 'listbox'>

export interface ListboxItem {
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
  ui?: Pick<Listbox['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>
  [key: string]: any
}

export interface ListboxProps<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> extends Pick<ListboxRootProps, 'by' | 'disabled' | 'highlightOnHover' | 'name' | 'orientation' | 'required' | 'selectionBehavior'> {
  id?: string
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: Listbox['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: Listbox['variants']['size']
  /**
   * The items to display in the list.
   */
  items?: T
  /**
   * The controlled value of the Listbox. Can be bound with `v-model`.
   */
  modelValue?: ApplyModifiers<GetModelValue<T, VK, M>, Mod>
  modelModifiers?: Mod
  /**
   * The default value when not controlled.
   */
  defaultValue?: ApplyModifiers<GetModelValue<T, VK, M>, Mod>
  /**
   * Whether multiple items can be selected.
   * @defaultValue false
   */
  multiple?: M & boolean
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * The key used to get the description from the item.
   * @defaultValue 'description'
   */
  descriptionKey?: GetItemKeys<T>
  /**
   * Whether the list is in a loading state.
   */
  loading?: boolean
  /**
   * The icon displayed when loading.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: IconProps['name']
  /**
   * Whether to display a filter input or not.
   * Can be an object to pass additional props to the input.
   * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
   * @defaultValue false
   */
  filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>
  /**
   * The fields to filter by.
   * @defaultValue [labelKey]
   */
  filterFields?: string[]
  /**
   * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue false
   */
  ignoreFilter?: boolean
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /**
   * Enable virtualization for large lists.
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
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  autofocus?: boolean
  autofocusDelay?: number
  class?: any
  ui?: Listbox['slots']
}

export type ListboxEmits<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> = Pick<ListboxRootEmits, 'entryFocus' | 'highlight' | 'leave'> & {
  'change': [event: Event]
  'update:modelValue': [value: ApplyModifiers<GetModelValue<T, VK, M>, Mod>]
}

type SlotProps<T> = (props: { item: T, index: number, ui: Listbox['ui'] }) => VNode[]

export type ListboxSlots<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>> = {
  'loading'?(props?: {}): VNode[]
  'empty'?(props: { searchTerm: string }): VNode[]
  'item'?: SlotProps<NestedItem<T>>
  'item-leading'?: SlotProps<NestedItem<T>>
  'item-label'?(props: { item: NestedItem<T>, index: number }): VNode[]
  'item-description'?(props: { item: NestedItem<T>, index: number }): VNode[]
  'item-trailing'?: SlotProps<NestedItem<T>>
}

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>">
import { ListboxRoot, ListboxContent, ListboxGroup, ListboxGroupLabel, ListboxVirtualizer, ListboxItem as RekaListboxItem, ListboxItemIndicator, ListboxFilter } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { createReusableTemplate, reactivePick } from '@vueuse/core'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFilter } from '../composables/useFilter'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { get, isArrayOfArray, looseToNumber } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ListboxProps<T, VK, M, Mod>>(), {
  labelKey: 'label',
  descriptionKey: 'description',
  highlightOnHover: true,
  filter: false,
  autofocusDelay: 0,
  virtualize: false
})
const emits = defineEmits<ListboxEmits<T, VK, M, Mod>>()
const slots = defineSlots<ListboxSlots<T>>()

const props = useComponentProps<ListboxProps<T, VK, M, Mod>>('listbox', _props)

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig() as Listbox['AppConfig']
const { filterGroups } = useFilter()

const rootProps = useForwardProps(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'multiple', 'selectionBehavior', 'highlightOnHover', 'by', 'orientation', 'required'), emits)

const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(filteredItems.value, size.value || 'md', props.descriptionKey as string, !!slots['item-description'])
  })
})
const inputProps = toRef(() => defu(typeof props.filter === 'object' ? props.filter : {}, { placeholder: t('listbox.search'), variant: 'none' }) as Omit<InputProps, 'modelValue' | 'defaultValue'>)

const { emitFormChange, emitFormInput, name, size, color, id, highlight, disabled, ariaAttrs } = useFormField<InputProps>(_props, { bind: false })

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: ListboxItem, index: number }>({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.listbox || {}) })({
  color: color.value ?? props.color,
  size: size.value ?? props.size,
  highlight: highlight.value ?? props.highlight,
  disabled: disabled.value,
  virtualize: !!props.virtualize
}))

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
}

function onSelect(e: Event, item: ListboxItem) {
  if (item.disabled) {
    e.preventDefault()
    return
  }

  item.onSelect?.(e)
}

const groups = computed<ListboxItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)

function isStructuralItem(item: ListboxItem): boolean {
  return !!item.type && ['label', 'separator'].includes(item.type)
}

const filteredGroups = computed(() => {
  if (props.ignoreFilter || !searchTerm.value) {
    return groups.value
  }

  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

  return filterGroups(groups.value, searchTerm.value, {
    fields,
    isStructural: isStructuralItem
  })
})
const filteredItems = computed(() => filteredGroups.value.flatMap(group => group) as NestedItem<T>[])
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineItemTemplate v-slot="{ item, index }">
    <ListboxGroupLabel v-if="item.type === 'label'" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
      {{ get(item, props.labelKey as string) }}
    </ListboxGroupLabel>

    <div v-else-if="item.type === 'separator'" role="separator" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator, item.class] })" />

    <RekaListboxItem
      v-else
      :value="props.valueKey ? get(item, props.valueKey as string) : item"
      :disabled="item.disabled"
      data-slot="item"
      :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
      @select="onSelect($event, item)"
    >
      <slot name="item" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
        <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index" :ui="ui">
          <UIcon v-if="item.icon" :name="item.icon" data-slot="itemLeadingIcon" :class="ui.itemLeadingIcon({ class: [props.ui?.itemLeadingIcon, item.ui?.itemLeadingIcon] })" />
          <UAvatar v-else-if="item.avatar" :size="((item.ui?.itemLeadingAvatarSize || props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="itemLeadingAvatar" :class="ui.itemLeadingAvatar({ class: [props.ui?.itemLeadingAvatar, item.ui?.itemLeadingAvatar] })" />
          <UChip
            v-else-if="item.chip"
            :size="((item.ui?.itemLeadingChipSize || props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
            inset
            standalone
            v-bind="item.chip"
            data-slot="itemLeadingChip"
            :class="ui.itemLeadingChip({ class: [props.ui?.itemLeadingChip, item.ui?.itemLeadingChip] })"
          />
        </slot>

        <span v-if="get(item, props.labelKey as string) || get(item, props.descriptionKey as string) || !!slots['item-label'] || !!slots['item-description']" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
          <span v-if="get(item, props.labelKey as string) || !!slots['item-label']" data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel] })">
            <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
              {{ get(item, props.labelKey as string) }}
            </slot>
          </span>

          <span v-if="get(item, props.descriptionKey as string) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
            <slot name="item-description" :item="(item as NestedItem<T>)" :index="index">
              {{ get(item, props.descriptionKey as string) }}
            </slot>
          </span>
        </span>

        <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
          <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" :ui="ui" />

          <ListboxItemIndicator as-child>
            <UIcon :name="props.selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
          </ListboxItemIndicator>
        </span>
      </slot>
    </RekaListboxItem>
  </DefineItemTemplate>

  <ListboxRoot
    :id="id"
    v-bind="{ ...rootProps, ...$attrs, ...ariaAttrs }"
    :disabled="disabled"
    :name="name"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    @update:model-value="onUpdate"
  >
    <ListboxFilter v-if="props.filter" v-model="searchTerm" as-child>
      <UInput
        :autofocus="props.autofocus"
        :autofocus-delay="props.autofocusDelay"
        :size="size"
        v-bind="inputProps"
        data-slot="input"
        :class="ui.input({ class: props.ui?.input })"
      />
    </ListboxFilter>

    <ListboxContent data-slot="content" :class="ui.content({ class: props.ui?.content })">
      <div v-if="props.loading" data-slot="loading" :class="ui.loading({ class: props.ui?.loading })">
        <slot name="loading">
          <UIcon :name="props.loadingIcon || appConfig.ui.icons.loading" data-slot="loadingIcon" :class="ui.loadingIcon({ class: props.ui?.loadingIcon })" />
        </slot>
      </div>
      <div v-else-if="!filteredItems.length" data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
        <slot name="empty" :search-term="searchTerm">
          {{ searchTerm ? t('listbox.noMatch', { searchTerm }) : t('listbox.noData') }}
        </slot>
      </div>

      <ListboxVirtualizer
        v-else-if="!!props.virtualize"
        v-slot="{ option: item, virtualItem }"
        :options="(filteredItems as any[])"
        :text-content="(item: any) => get(item, props.labelKey as string)"
        v-bind="virtualizerProps"
      >
        <ReuseItemTemplate :item="item" :index="virtualItem.index" />
      </ListboxVirtualizer>

      <template v-else>
        <ListboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" data-slot="group" :class="ui.group({ class: props.ui?.group })">
          <ReuseItemTemplate v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`" :item="item" :index="index" />
        </ListboxGroup>
      </template>
    </ListboxContent>
  </ListboxRoot>
</template>
