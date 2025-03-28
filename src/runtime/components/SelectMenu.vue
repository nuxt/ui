<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/select-menu'
import type { UseComponentIconsProps } from '../composables/useComponentIcons'
import { tv } from '../utils/tv'
import type { AvatarProps, ChipProps, InputProps } from '../types'
import type {
  AcceptableValue,
  ArrayOrNested,
  GetItemKeys,
  GetItemValue,
  GetModelValue,
  GetModelValueEmits,
  NestedItem,
  PartialString,
  EmitsToProps
} from '../types/utils'

const appConfigSelectMenu = _appConfig as AppConfig & { ui: { selectMenu: Partial<typeof theme> } }

const selectMenu = tv({ extend: tv(theme), ...(appConfigSelectMenu.ui?.selectMenu || {}) })

interface _SelectMenuItem {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  /**
   * The item type.
   * @defaultValue 'item'
   */
  type?: 'label' | 'separator' | 'item'
  value?: string | number
  disabled?: boolean
  onSelect?(e?: Event): void
  [key: string]: any
}
export type SelectMenuItem = _SelectMenuItem | AcceptableValue | boolean

type SelectMenuVariants = VariantProps<typeof selectMenu>

export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'highlightOnHover'>, UseComponentIconsProps {
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
  color?: SelectMenuVariants['color']
  /**
   * @defaultValue 'outline'
   */
  variant?: SelectMenuVariants['variant']
  /**
   * @defaultValue 'md'
   */
  size?: SelectMenuVariants['size']
  required?: boolean
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: string
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
  portal?: boolean
  /**
   * When `items` is an array of objects, select the field to use as the value instead of the object itself.
   * @defaultValue undefined
   */
  valueKey?: VK
  /**
   * When `items` is an array of objects, select the field to use as the label.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>
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
  class?: any
  ui?: PartialString<typeof selectMenu.slots>
}

export type SelectMenuEmits<A extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean> = Pick<ComboboxRootEmits, 'update:open'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
  create: [item: string]
  /** Event handler when highlighted element changes. */
  highlight: [payload: {
    ref: HTMLElement
    value: GetModelValue<A, VK, M>
  } | undefined]
} & GetModelValueEmits<A, VK, M>

type SlotProps<T extends SelectMenuItem> = (props: { item: T, index: number }) => any

export interface SelectMenuSlots<
  A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>,
  VK extends GetItemKeys<A> | undefined = undefined,
  M extends boolean = false,
  T extends NestedItem<A> = NestedItem<A>
> {
  'leading'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: ReturnType<typeof selectMenu> }): any
  'default'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean }): any
  'trailing'(props: { modelValue?: GetModelValue<A, VK, M>, open: boolean, ui: ReturnType<typeof selectMenu> }): any
  'empty'(props: { searchTerm?: string }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'create-item-label'(props: { item: string }): any
}
</script>

<script setup lang="ts" generic="T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false">
import { computed, toRef, toRaw } from 'vue'
import { ComboboxRoot, ComboboxArrow, ComboboxAnchor, ComboboxInput, ComboboxTrigger, ComboboxPortal, ComboboxContent, ComboboxViewport, ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxItem, ComboboxItemIndicator, FocusScope, useForwardPropsEmits, useFilter } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useButtonGroup } from '../composables/useButtonGroup'
import { useComponentIcons } from '../composables/useComponentIcons'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { compare, get, isArrayOfArray } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SelectMenuProps<T, VK, M>>(), {
  portal: true,
  searchInput: true,
  labelKey: 'label' as never,
  resetSearchTermOnBlur: true
})
const emits = defineEmits<SelectMenuEmits<T, VK, M>>()
const slots = defineSlots<SelectMenuSlots<T, VK, M>>()

const searchTerm = defineModel<string>('searchTerm', { default: '' })

const { t } = useLocale()
const appConfig = useAppConfig()
const { contains } = useFilter({ sensitivity: 'base' })

const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'required', 'multiple', 'resetSearchTermOnBlur', 'highlightOnHover'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as ComboboxContentProps)
const arrowProps = toRef(() => props.arrow as ComboboxArrowProps)
const searchInputProps = toRef(() => defu(props.searchInput, { placeholder: t('selectMenu.search'), variant: 'none' }) as InputProps)

const { emitFormBlur, emitFormFocus, emitFormInput, emitFormChange, size: formGroupSize, color, id, name, highlight, disabled, ariaAttrs } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: appConfig.ui.icons.chevronDown })))

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const [DefineCreateItemTemplate, ReuseCreateItemTemplate] = createReusableTemplate()

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

function displayValue(value: GetItemValue<T, VK> | GetItemValue<T, VK>[]): string {
  if (props.multiple && Array.isArray(value)) {
    return value.map(v => displayValue(v)).filter(Boolean).join(', ')
  }

  if (!props.valueKey) {
    return value && (typeof value === 'object' ? get(value, props.labelKey as string) : value)
  }

  const item = items.value.find(item => compare(typeof item === 'object' ? get(item as Record<string, any>, props.valueKey as string) : item, value))
  return item && (typeof item === 'object' ? get(item, props.labelKey as string) : item)
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
    if (typeof item !== 'object' || item === null) {
      return contains(String(item), searchTerm.value)
    }

    if (item.type && ['label', 'separator'].includes(item.type)) {
      return true
    }

    return fields.some(field => contains(get(item, field), searchTerm.value))
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
    return !filteredItems.value.find(item => compare(item, newItem, String(props.valueKey)))
  }

  return !filteredItems.value.length
})
const createItemPosition = computed(() => typeof props.createItem === 'object' ? props.createItem.position : 'bottom')

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

function isSelectItem(item: SelectMenuItem): item is _SelectMenuItem {
  return typeof item === 'object' && item !== null
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineCreateItemTemplate>
    <ComboboxGroup :class="ui.group({ class: props.ui?.group })">
      <ComboboxItem
        :class="ui.item({ class: props.ui?.item })"
        :value="searchTerm"
        @select.prevent="emits('create', searchTerm)"
      >
        <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
          <slot name="create-item-label" :item="searchTerm">
            {{ t('selectMenu.create', { label: searchTerm }) }}
          </slot>
        </span>
      </ComboboxItem>
    </ComboboxGroup>
  </DefineCreateItemTemplate>

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
      <ComboboxTrigger :class="ui.base({ class: [props.class, props.ui?.base] })" tabindex="0">
        <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
          <slot name="leading" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <UIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
            <UAvatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
          </slot>
        </span>

        <slot :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open">
          <template v-for="displayedModelValue in [displayValue(modelValue as GetModelValue<T, VK, M>)]" :key="displayedModelValue">
            <span v-if="displayedModelValue" :class="ui.value({ class: props.ui?.value })">
              {{ displayedModelValue }}
            </span>
            <span v-else :class="ui.placeholder({ class: props.ui?.placeholder })">
              {{ placeholder ?? '&nbsp;' }}
            </span>
          </template>
        </slot>

        <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
          <slot name="trailing" :model-value="(modelValue as GetModelValue<T, VK, M>)" :open="open" :ui="ui">
            <UIcon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </span>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxPortal :disabled="!portal">
      <ComboboxContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <FocusScope trapped :class="ui.focusScope({ class: props.ui?.focusScope })">
          <ComboboxInput v-if="!!searchInput" v-model="searchTerm" :display-value="() => searchTerm" as-child>
            <UInput autofocus autocomplete="off" v-bind="searchInputProps" :class="ui.input({ class: props.ui?.input })" />
          </ComboboxInput>

          <ComboboxEmpty :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :search-term="searchTerm">
              {{ searchTerm ? t('selectMenu.noMatch', { searchTerm }) : t('selectMenu.noData') }}
            </slot>
          </ComboboxEmpty>

          <ComboboxViewport :class="ui.viewport({ class: props.ui?.viewport })">
            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'top'" />

            <ComboboxGroup v-for="(group, groupIndex) in filteredGroups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
              <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
                <ComboboxLabel v-if="isSelectItem(item) && item.type === 'label'" :class="ui.label({ class: props.ui?.label })">
                  {{ get(item, props.labelKey as string) }}
                </ComboboxLabel>

                <ComboboxSeparator v-else-if="isSelectItem(item) && item.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

                <ComboboxItem
                  v-else
                  :class="ui.item({ class: props.ui?.item })"
                  :disabled="isSelectItem(item) && item.disabled"
                  :value="props.valueKey && isSelectItem(item) ? get(item, props.valueKey as string) : item"
                  @select="isSelectItem(item) && item.onSelect"
                >
                  <slot name="item" :item="(item as NestedItem<T>)" :index="index">
                    <slot name="item-leading" :item="(item as NestedItem<T>)" :index="index">
                      <UIcon v-if="isSelectItem(item) && item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
                      <UAvatar v-else-if="isSelectItem(item) && item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
                      <UChip
                        v-else-if="isSelectItem(item) && item.chip"
                        :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                        inset
                        standalone
                        v-bind="item.chip"
                        :class="ui.itemLeadingChip({ class: props.ui?.itemLeadingChip })"
                      />
                    </slot>

                    <span :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                      <slot name="item-label" :item="(item as NestedItem<T>)" :index="index">
                        {{ isSelectItem(item) ? get(item, props.labelKey as string) : item }}
                      </slot>
                    </span>

                    <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                      <slot name="item-trailing" :item="(item as NestedItem<T>)" :index="index" />

                      <ComboboxItemIndicator as-child>
                        <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                      </ComboboxItemIndicator>
                    </span>
                  </slot>
                </ComboboxItem>
              </template>
            </ComboboxGroup>

            <ReuseCreateItemTemplate v-if="createItem && createItemPosition === 'bottom'" />
          </ComboboxViewport>
        </FocusScope>

        <ComboboxArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
