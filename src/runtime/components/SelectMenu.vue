<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/select-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type { AcceptableValue, ArrayOrWrapped, PartialString, MaybeArrayOfArray, MaybeArrayOfArrayItem, SelectModelValue, SelectModelValueEmits, SelectItemKey } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { selectMenu: Partial<typeof theme> } }

const selectMenu = tv({ extend: tv(theme), ...(appConfig.ui?.selectMenu || {}) })

export interface SelectMenuItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  disabled?: boolean
  onSelect?(e?: Event): void
}

type SelectMenuVariants = VariantProps<typeof selectMenu>

export interface SelectMenuProps<T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectMenuItem | AcceptableValue> = MaybeArrayOfArray<SelectMenuItem | AcceptableValue>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'defaultValue' | 'selectedValue' | 'open' | 'defaultOpen' | 'searchTerm' | 'disabled' | 'name' | 'resetSearchTermOnBlur'>, UseComponentIconsProps {
  id?: string
  /** The placeholder text when the select is empty. */
  placeholder?: string
  /**
   * Wether to display the search input or not.
   * Can be an object to pass additional props to the input.
   * @defaultValue { placeholder: 'Search...' }
   */
  searchInput?: boolean | { placeholder?: string }
  color?: SelectMenuVariants['color']
  variant?: SelectMenuVariants['variant']
  size?: SelectMenuVariants['size']
  required?: boolean
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  trailingIcon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   */
  selectedIcon?: string
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8, position: 'popper' }
   */
  content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * Whether to filter items or not, can be an array of fields to filter.
   * When `false`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
   * @defaultValue ['label']
   */
  filter?: boolean | string[]
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: V
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: V
  items?: I
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: PartialString<typeof selectMenu.slots>
  /** The controlled value of the Combobox. Can be binded-with with `v-model`. */
  modelValue?: SelectModelValue<T, V, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M
}

export type SelectMenuEmits<T, V, M extends boolean> = Omit<ComboboxRootEmits<T>, 'update:modelValue'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
} & SelectModelValueEmits<T, V, M>

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface SelectMenuSlots<T> {
  'leading'(props: { modelValue: T, open: boolean, ui: any }): any
  'default'(props: { modelValue: T, open: boolean }): any
  'trailing'(props: { modelValue: T, open: boolean, ui: any }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}

extendDevtoolsMeta({ defaultProps: { items: ['Option 1', 'Option 2', 'Option 3'] } })
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectMenuItem | AcceptableValue> = MaybeArrayOfArray<SelectMenuItem | AcceptableValue>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false">
import { computed, toRef } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, useForwardPropsEmits } from 'radix-vue'
import { defu } from 'defu'
import { isEqual } from 'ohash'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { get, escapeRegExp } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'

const props = withDefaults(defineProps<SelectMenuProps<T, I, V, M>>(), {
  search: true,
  portal: true,
  autofocusDelay: 0,
  searchInput: () => ({ placeholder: 'Search...' }),
  filter: () => ['label'],
  labelKey: 'label' as never
})

const emits = defineEmits<SelectMenuEmits<T, V, M>>()
const slots = defineSlots<SelectMenuSlots<T>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const appConfig = useAppConfig()

const { t } = useLocale()
const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'selectedValue', 'open', 'defaultOpen', 'resetSearchTermOnBlur'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)
// This is a hack due to generic boolean casting (see https://github.com/nuxt/ui/issues/2541)
const multiple = toRef(() => typeof props.multiple === 'string' ? true : props.multiple)

const { emitFormBlur, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => selectMenu({
  color: color.value,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: highlight.value,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value
}))

function displayValue(value: T | T[]): string {
  if (multiple.value && Array.isArray(value)) {
    return value.map(v => displayValue(v)).filter(Boolean).join(', ')
  }

  if (!props.valueKey) {
    return value && (typeof value === 'object' ? get(value, props.labelKey as string) : value)
  }

  const item = items.value.find(item => isEqual(get(item as Record<string, any>, props.valueKey as string), value))

  return item && (typeof item === 'object' ? get(item, props.labelKey as string) : item)
}

function filterFunction(items: ArrayOrWrapped<T>, searchTerm: string): ArrayOrWrapped<T> {
  if (props.filter === false) {
    return items
  }

  const fields = Array.isArray(props.filter) ? props.filter : [props.labelKey]
  const escapedSearchTerm = escapeRegExp(searchTerm)

  return items.filter((item: T) => {
    if (typeof item !== 'object') {
      return String(item).search(new RegExp(escapedSearchTerm, 'i')) !== -1
    }

    return fields.some((field) => {
      const child = get(item, field as string)

      return child !== null && child !== undefined && String(child).search(new RegExp(escapedSearchTerm, 'i')) !== -1
    })
  }) as ArrayOrWrapped<T>
}

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as SelectMenuItem[][] : [])
// eslint-disable-next-line vue/no-dupe-keys
const items = computed(() => groups.value.flatMap(group => group) as T[])

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

function onUpdateOpen(value: boolean) {
  if (!value) {
    const event = new FocusEvent('blur')
    emits('blur', event)
    emitFormBlur()
  } else {
    const event = new FocusEvent('focus')
    emits('focus', event)
  }
}
</script>

<template>
  <ComboboxRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    v-model:search-term="searchTerm"
    as-child
    :name="name"
    :disabled="disabled"
    :multiple="multiple"
    :display-value="() => searchTerm"
    :filter-function="filterFunction"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <ComboboxAnchor as-child>
      <ComboboxTrigger :class="ui.base({ class: [props.class, props.ui?.base] })" tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="(modelValue as T)" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="(modelValue as T)" :open="open">
          <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
            <span v-if="displayedModelValue" :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="(modelValue as T)" :open="open" :ui="ui">
            <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <ComboboxInput
          v-if="!!searchInput"
          autofocus
          autocomplete="off"
          v-bind="typeof searchInput === 'object' ? searchInput : {}"
          :class="ui.input({ class: props.ui?.input })"
        />

        <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
          <slot name="empty" :search-term="searchTerm">
            {{ searchTerm ? t('ui.selectMenu.noMatch', { search: searchTerm }) : t('ui.selectMenu.noData') }}
          </slot>
        </ComboboxEmpty>

        <ComboboxViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <ComboboxGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <ComboboxLabel v-if="item?.type === 'label'" :class="ui.label({ class: props.ui?.label })">
                {{ get(item, props.labelKey as string) }}
              </ComboboxLabel>

              <ComboboxSeparator v-else-if="item?.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

              <ComboboxItem
                v-else
                :class="ui.item({ class: props.ui?.item })"
                :disabled="item.disabled"
                :value="valueKey && typeof item === 'object' ? get(item, props.valueKey as string) : item"
                @select="item.onSelect"
              >
                <slot name="item" :item="(item as T)" :index="index">
                  <slot name="item-leading" :item="(item as T)" :index="index">
                    <UIcon v-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
                    <UAvatar v-else-if="item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
                    <UChip
                      v-else-if="item.chip"
                      :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="ui.itemLeadingChip({ class: props.ui?.itemLeadingChip })"
                    />
                  </slot>

                  <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ typeof item === 'object' ? get(item, props.labelKey as string) : item }}
                    </slot>
                  </span>

                  <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <ComboboxItemIndicator as-child>
                      <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                    </ComboboxItemIndicator>
                  </span>
                </slot>
              </ComboboxItem>
            </template>
          </ComboboxGroup>
        </ComboboxViewport>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
