<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { PropType, VNode } from 'vue'
import type { ListboxRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/transfer-list'
import type { AvatarProps } from './Avatar.vue'
import type { ButtonProps } from './Button.vue'
import type { ChipProps } from './Chip.vue'
import type { IconProps } from './Icon.vue'
import type { InputProps } from './Input.vue'
import type { GetItemKeys, GetModelValue } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type TransferList = ComponentConfig<typeof theme, AppConfig, 'transferList'>

export type TransferListSide = 'source' | 'target'

export interface TransferListItem {
  label?: string
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  chip?: ChipProps
  disabled?: boolean
  class?: any
  ui?: Partial<Pick<TransferList['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>>
  [key: string]: any
}

export interface TransferListProps<T extends TransferListItem[] = TransferListItem[], VK extends GetItemKeys<T> | undefined = undefined> extends Pick<ListboxRootProps, 'disabled' | 'highlightOnHover' | 'loop' | 'selectionBehavior'> {
  id?: string
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: TransferList['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: TransferList['variants']['size']
  /**
   * All the items that can be transferred. Items whose value is in `modelValue` are displayed in the target list, the others in the source list.
   */
  items?: T
  /**
   * The values of the items in the target list, in order. Can be bound with `v-model`.
   */
  modelValue?: GetModelValue<T, VK, true>
  /**
   * The values of the items in the target list when not controlled.
   */
  defaultValue?: GetModelValue<T, VK, true>
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
   * The title displayed in the header of the source list.
   * @defaultValue t('transferList.source')
   */
  sourceLabel?: string
  /**
   * The title displayed in the header of the target list.
   * @defaultValue t('transferList.target')
   */
  targetLabel?: string
  /**
   * Whether to display a filter input in each list or not.
   * Can be an object to pass additional props to the inputs.
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
   * Display a header with a "select all" checkbox, the label and the selection count above each list.
   * @defaultValue true
   */
  header?: boolean
  /**
   * Display the buttons that move every visible item at once.
   * @defaultValue true
   */
  moveAll?: boolean
  /**
   * Move an item to the other list when it is double-clicked.
   * @defaultValue true
   */
  moveOnDoubleClick?: boolean
  /**
   * Customize the move buttons. Accepts every [Button](/docs/components/button) prop.
   * `{ color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  controls?: Omit<ButtonProps, 'icon' | 'onClick'>
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  selectedIcon?: IconProps['name']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  class?: any
  ui?: TransferList['slots']
}

export type TransferListEmits<T extends TransferListItem[] = TransferListItem[], VK extends GetItemKeys<T> | undefined = undefined> = {
  'update:modelValue': [value: GetModelValue<T, VK, true>]
  'change': [event: Event]
  'move': [payload: { items: T[number][], to: TransferListSide }]
}

type ItemSlotProps<T> = (props: { item: T, index: number, side: TransferListSide, ui: TransferList['ui'] }) => VNode[]

export type TransferListSlots<T extends TransferListItem[] = TransferListItem[]> = {
  'header'?(props: { side: TransferListSide, items: T[number][], selected: T[number][], label?: string }): VNode[]
  'empty'?(props: { side: TransferListSide, searchTerm: string }): VNode[]
  'controls'?(props: {
    moveToTarget: () => void
    moveAllToTarget: () => void
    moveToSource: () => void
    moveAllToSource: () => void
    canMoveToTarget: boolean
    canMoveAllToTarget: boolean
    canMoveToSource: boolean
    canMoveAllToSource: boolean
  }): VNode[]
  'item'?: ItemSlotProps<T[number]>
  'item-leading'?: ItemSlotProps<T[number]>
  'item-label'?(props: { item: T[number], index: number, side: TransferListSide }): VNode[]
  'item-description'?(props: { item: T[number], index: number, side: TransferListSide }): VNode[]
  'item-trailing'?: ItemSlotProps<T[number]>
}

</script>

<script setup lang="ts" generic="T extends TransferListItem[], VK extends GetItemKeys<T> | undefined = undefined">
import { computed, ref, useId, watch } from 'vue'
import { Primitive, ListboxRoot, ListboxContent, ListboxItem as RekaListboxItem, ListboxItemIndicator, ListboxFilter } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { defu } from 'defu'
import { isEqual } from 'ohash/utils'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { useFilter } from '../composables/useFilter'
import { useFormField } from '../composables/useFormField'
import { useLocale } from '../composables/useLocale'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UCheckbox from './Checkbox.vue'
import UChip from './Chip.vue'
import UInput from './Input.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<TransferListProps<T, VK>>(), {
  labelKey: 'label',
  descriptionKey: 'description',
  highlightOnHover: true,
  selectionBehavior: 'toggle',
  filter: false,
  header: true,
  moveAll: true,
  moveOnDoubleClick: true
})
const emits = defineEmits<TransferListEmits<T, VK>>()
const slots = defineSlots<TransferListSlots<T>>()

const props = useComponentProps<TransferListProps<T, VK>>('transferList', _props)

const { t, dir } = useLocale()
const appConfig = useAppConfig() as TransferList['AppConfig']
const { filterGroups } = useFilter()

const { emitFormChange, emitFormInput, size: formFieldSize, color: formFieldColor, id: formFieldId, highlight: formFieldHighlight, disabled: formFieldDisabled } = useFormField<InputProps>(_props, { bind: false })

// eslint-disable-next-line vue/no-dupe-keys
const color = computed(() => formFieldColor.value ?? props.color)
// eslint-disable-next-line vue/no-dupe-keys
const highlight = computed(() => formFieldHighlight.value ?? props.highlight)
// eslint-disable-next-line vue/no-dupe-keys
const size = computed(() => formFieldSize.value ?? props.size)

const disabled = computed(() => formFieldDisabled.value ?? props.disabled)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.transferList || {}) })({
  color: color.value,
  size: size.value,
  highlight: highlight.value,
  disabled: disabled.value
}))

const baseId = useId()
const sides: TransferListSide[] = ['source', 'target']

const inputProps = computed(() => defu(typeof props.filter === 'object' ? props.filter : {}, { placeholder: t('listbox.search'), variant: 'none' }) as Omit<InputProps, 'modelValue' | 'defaultValue'>)
const controlProps = computed(() => defu(props.controls, { color: 'neutral', variant: 'outline', size: size.value, square: true }) as ButtonProps)

const moveToTargetIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight)
const moveAllToTargetIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleLeft : appConfig.ui.icons.chevronDoubleRight)
const moveToSourceIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronRight : appConfig.ui.icons.chevronLeft)
const moveAllToSourceIcon = computed(() => dir.value === 'rtl' ? appConfig.ui.icons.chevronDoubleRight : appConfig.ui.icons.chevronDoubleLeft)

type Item = T[number]

// Value

const internalValue = ref<any[]>((props.defaultValue as any[] | undefined) ?? [])
const currentValue = computed<any[]>(() => (props.modelValue as any[] | undefined) ?? internalValue.value)

function getValue(item: Item) {
  return props.valueKey ? get(item, props.valueKey as string) : item
}

function getLabel(item: Item) {
  return get(item, props.labelKey as string)
}

function includesValue(values: any[], value: any) {
  return values.some(v => isEqual(v, value))
}

const allItems = computed<Item[]>(() => (props.items ?? []) as Item[])

const lists = computed<Record<TransferListSide, Item[]>>(() => ({
  source: allItems.value.filter(item => !includesValue(currentValue.value, getValue(item))),
  // Keep the order of `modelValue` so items moved last end up at the bottom.
  target: currentValue.value
    .map(value => allItems.value.find(item => isEqual(getValue(item), value)))
    .filter((item): item is Item => item !== undefined)
}))

// Selection & filtering, per side

const selection = ref<Record<TransferListSide, any[]>>({ source: [], target: [] })
const searchTerms = ref<Record<TransferListSide, string>>({ source: '', target: '' })

const filteredLists = computed<Record<TransferListSide, Item[]>>(() => {
  const fields = Array.isArray(props.filterFields) ? props.filterFields : [props.labelKey] as string[]

  return Object.fromEntries(sides.map((side) => {
    const term = searchTerms.value[side]
    return [side, term ? filterGroups([lists.value[side]], term, { fields })[0] ?? [] : lists.value[side]]
  })) as Record<TransferListSide, Item[]>
})

// Drop selected values that are no longer displayed in their list (moved, filtered out or removed from `items`).
watch(filteredLists, (filtered) => {
  for (const side of sides) {
    const visible = filtered[side].map(getValue)
    const next = selection.value[side].filter(value => includesValue(visible, value))
    if (next.length !== selection.value[side].length) {
      selection.value[side] = next
    }
  }
})

function movableItems(side: TransferListSide, onlySelected: boolean) {
  return filteredLists.value[side].filter(item => !item.disabled && (!onlySelected || includesValue(selection.value[side], getValue(item))))
}

const selectableItems = computed<Record<TransferListSide, Item[]>>(() => ({
  source: movableItems('source', false),
  target: movableItems('target', false)
}))

const selectedItems = computed<Record<TransferListSide, Item[]>>(() => ({
  source: movableItems('source', true),
  target: movableItems('target', true)
}))

function selectAllState(side: TransferListSide): boolean | 'indeterminate' {
  const selected = selectedItems.value[side].length
  if (!selected) return false
  return selected === selectableItems.value[side].length ? true : 'indeterminate'
}

function toggleAll(side: TransferListSide) {
  selection.value[side] = selectAllState(side) === true ? [] : selectableItems.value[side].map(getValue)
}

// Moving

function move(itemsToMove: Item[], to: TransferListSide) {
  if (disabled.value || !itemsToMove.length) return

  const values = itemsToMove.map(getValue)
  const next = to === 'target'
    ? [...currentValue.value, ...values]
    : currentValue.value.filter(value => !includesValue(values, value))

  const from: TransferListSide = to === 'target' ? 'source' : 'target'
  selection.value[from] = selection.value[from].filter(value => !includesValue(values, value))

  internalValue.value = next
  emits('update:modelValue', next as GetModelValue<T, VK, true>)
  emits('move', { items: itemsToMove, to })

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value: next } })
  emits('change', event)
  emitFormChange()
  emitFormInput()
}

const moveToTarget = () => move(selectedItems.value.source, 'target')
const moveAllToTarget = () => move(selectableItems.value.source, 'target')
const moveToSource = () => move(selectedItems.value.target, 'source')
const moveAllToSource = () => move(selectableItems.value.target, 'source')

const controlsState = computed(() => ({
  canMoveToTarget: !disabled.value && selectedItems.value.source.length > 0,
  canMoveAllToTarget: !disabled.value && selectableItems.value.source.length > 0,
  canMoveToSource: !disabled.value && selectedItems.value.target.length > 0,
  canMoveAllToSource: !disabled.value && selectableItems.value.target.length > 0
}))

function onDoubleClick(item: Item, side: TransferListSide) {
  if (!props.moveOnDoubleClick || item.disabled) return
  move([item], side === 'source' ? 'target' : 'source')
}

function labelFor(side: TransferListSide) {
  return side === 'source' ? (props.sourceLabel ?? t('transferList.source')) : (props.targetLabel ?? t('transferList.target'))
}

const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate<{ side: TransferListSide }>({
  props: {
    side: {
      type: String as PropType<TransferListSide>,
      required: true
    }
  }
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineListTemplate v-slot="{ side }">
    <div :data-side="side" data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <div v-if="props.header || !!slots.header" data-slot="header" :class="ui.header({ class: props.ui?.header })">
        <slot name="header" :side="side" :items="lists[side]" :selected="selectedItems[side]" :label="labelFor(side)">
          <UCheckbox
            :model-value="selectAllState(side)"
            :disabled="disabled || !selectableItems[side].length"
            :color="color"
            :size="size"
            :aria-label="t('transferList.selectAll')"
            data-slot="headerCheckbox"
            :class="ui.headerCheckbox({ class: props.ui?.headerCheckbox })"
            @update:model-value="toggleAll(side)"
          />

          <span :id="`${baseId}-${side}-label`" data-slot="headerLabel" :class="ui.headerLabel({ class: props.ui?.headerLabel })">
            {{ labelFor(side) }}
          </span>

          <span data-slot="headerCount" :class="ui.headerCount({ class: props.ui?.headerCount })">
            {{ selectedItems[side].length }}/{{ lists[side].length }}
          </span>
        </slot>
      </div>

      <ListboxRoot
        v-model="selection[side]"
        multiple
        :disabled="disabled"
        :highlight-on-hover="props.highlightOnHover"
        :loop="props.loop"
        :selection-behavior="props.selectionBehavior"
        data-slot="listbox"
        :class="ui.listbox({ class: props.ui?.listbox })"
      >
        <ListboxFilter v-if="props.filter" v-model="searchTerms[side]" as-child>
          <UInput
            :size="size"
            v-bind="inputProps"
            data-slot="input"
            :class="ui.input({ class: props.ui?.input })"
          />
        </ListboxFilter>

        <ListboxContent
          :aria-labelledby="props.header && !slots.header ? `${baseId}-${side}-label` : undefined"
          :aria-label="props.header && !slots.header ? undefined : labelFor(side)"
          data-slot="content"
          :class="ui.content({ class: props.ui?.content })"
        >
          <div v-if="!filteredLists[side].length" data-slot="empty" :class="ui.empty({ class: props.ui?.empty })">
            <slot name="empty" :side="side" :search-term="searchTerms[side]">
              {{ searchTerms[side] ? t('listbox.noMatch', { searchTerm: searchTerms[side] }) : t('listbox.noData') }}
            </slot>
          </div>

          <RekaListboxItem
            v-for="(item, index) in filteredLists[side]"
            v-else
            :key="`${side}-${String(props.valueKey ? getValue(item) : getLabel(item) ?? index)}`"
            :value="getValue(item)"
            :disabled="item.disabled"
            data-slot="item"
            :class="ui.item({ class: [props.ui?.item, item.ui?.item, item.class] })"
            @dblclick="onDoubleClick(item, side)"
          >
            <slot name="item" :item="item" :index="index" :side="side" :ui="ui">
              <slot name="item-leading" :item="item" :index="index" :side="side" :ui="ui">
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

              <span v-if="getLabel(item) || get(item, props.descriptionKey as string) || !!slots['item-label'] || !!slots['item-description']" data-slot="itemWrapper" :class="ui.itemWrapper({ class: [props.ui?.itemWrapper, item.ui?.itemWrapper] })">
                <span v-if="getLabel(item) || !!slots['item-label']" data-slot="itemLabel" :class="ui.itemLabel({ class: [props.ui?.itemLabel, item.ui?.itemLabel] })">
                  <slot name="item-label" :item="item" :index="index" :side="side">
                    {{ getLabel(item) }}
                  </slot>
                </span>

                <span v-if="get(item, props.descriptionKey as string) || !!slots['item-description']" data-slot="itemDescription" :class="ui.itemDescription({ class: [props.ui?.itemDescription, item.ui?.itemDescription] })">
                  <slot name="item-description" :item="item" :index="index" :side="side">
                    {{ get(item, props.descriptionKey as string) }}
                  </slot>
                </span>
              </span>

              <span data-slot="itemTrailing" :class="ui.itemTrailing({ class: [props.ui?.itemTrailing, item.ui?.itemTrailing] })">
                <slot name="item-trailing" :item="item" :index="index" :side="side" :ui="ui" />

                <ListboxItemIndicator as-child>
                  <UIcon :name="props.selectedIcon || appConfig.ui.icons.check" data-slot="itemTrailingIcon" :class="ui.itemTrailingIcon({ class: [props.ui?.itemTrailingIcon, item.ui?.itemTrailingIcon] })" />
                </ListboxItemIndicator>
              </span>
            </slot>
          </RekaListboxItem>
        </ListboxContent>
      </ListboxRoot>
    </div>
  </DefineListTemplate>

  <Primitive :id="props.id ?? formFieldId" :as="props.as" data-slot="root" v-bind="$attrs" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ReuseListTemplate side="source" />

    <div data-slot="controls" :class="ui.controls({ class: props.ui?.controls })">
      <slot
        name="controls"
        v-bind="controlsState"
        :move-to-target="moveToTarget"
        :move-all-to-target="moveAllToTarget"
        :move-to-source="moveToSource"
        :move-all-to-source="moveAllToSource"
      >
        <UButton
          v-if="props.moveAll"
          v-bind="controlProps"
          :icon="moveAllToTargetIcon"
          :aria-label="t('transferList.moveAllToTarget')"
          :disabled="!controlsState.canMoveAllToTarget"
          data-slot="control"
          :class="ui.control({ class: props.ui?.control })"
          @click="moveAllToTarget"
        />
        <UButton
          v-bind="controlProps"
          :icon="moveToTargetIcon"
          :aria-label="t('transferList.moveToTarget')"
          :disabled="!controlsState.canMoveToTarget"
          data-slot="control"
          :class="ui.control({ class: props.ui?.control })"
          @click="moveToTarget"
        />
        <UButton
          v-bind="controlProps"
          :icon="moveToSourceIcon"
          :aria-label="t('transferList.moveToSource')"
          :disabled="!controlsState.canMoveToSource"
          data-slot="control"
          :class="ui.control({ class: props.ui?.control })"
          @click="moveToSource"
        />
        <UButton
          v-if="props.moveAll"
          v-bind="controlProps"
          :icon="moveAllToSourceIcon"
          :aria-label="t('transferList.moveAllToSource')"
          :disabled="!controlsState.canMoveAllToSource"
          data-slot="control"
          :class="ui.control({ class: props.ui?.control })"
          @click="moveAllToSource"
        />
      </slot>
    </div>

    <ReuseListTemplate side="target" />
  </Primitive>
</template>
