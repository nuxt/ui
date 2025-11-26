<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { TreeRootProps, TreeRootEmits, TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/tree'
import type { IconProps } from '../types'
import type { DynamicSlots, GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Tree = ComponentConfig<typeof theme, AppConfig, 'tree'>

export type TreeItem = {
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  label?: string
  /**
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  defaultExpanded?: boolean
  disabled?: boolean
  slot?: string
  children?: TreeItem[]
  onToggle?: (e: TreeItemToggleEvent<TreeItem>) => void
  onSelect?: (e: TreeItemSelectEvent<TreeItem>) => void
  class?: any
  ui?: Pick<Tree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon' | 'listWithChildren'>
  [key: string]: any
}

export interface TreeProps<T extends TreeItem[] = TreeItem[], M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'ul'
   */
  as?: any | { root?: any, link?: any }
  /**
   * @defaultValue 'primary'
   */
  color?: Tree['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: Tree['variants']['size']
  /** This function is passed the index of each item and should return a unique key for that item */
  getKey?: (val: T[number]) => string
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  /**
   * The icon displayed on the right side of a parent node.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when a parent node is expanded.
   * @defaultValue appConfig.ui.icons.folderOpen
   * @IconifyIcon
   */
  expandedIcon?: IconProps['name']
  /**
   * The icon displayed when a parent node is collapsed.
   * @defaultValue appConfig.ui.icons.folder
   * @IconifyIcon
   */
  collapsedIcon?: IconProps['name']
  items?: T
  /** The controlled value of the Tree. Can be bind as `v-model`. */
  modelValue?: M extends true ? T[number][] : T[number]
  /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
  defaultValue?: M extends true ? T[number][] : T[number]
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  /**
   * Use nested DOM structure (children inside parents) vs flattened structure (all items at same level).
   * When `virtualize` is enabled, this is automatically set to `false`.
   * @defaultValue true
   */
  nested?: boolean
  /**
   * Enable virtualization for large lists.
   * Note: when enabled, the tree structure is flattened like if `nested` was set to `false`.
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
  onSelect?: (e: TreeItemSelectEvent<T[number]>, item: T[number]) => void
  onToggle?: (e: TreeItemToggleEvent<T[number]>, item: T[number]) => void
  class?: any
  ui?: Tree['slots']
}

export type TreeEmits<T extends TreeItem[] = TreeItem[], M extends boolean = false> = TreeRootEmits<T[number], M>

type SlotProps<T extends TreeItem> = (props: {
  item: T
  index: number
  level: number
  expanded: boolean
  selected: boolean
  indeterminate: boolean | undefined
  handleSelect: () => void
  handleToggle: () => void
  ui: Tree['ui']
}) => any

export type TreeSlots<
  T extends TreeItem[] = TreeItem[]
> = {
  'item-wrapper': SlotProps<T[number]>
  'item': SlotProps<T[number]>
  'item-leading': SlotProps<T[number]>
  'item-label': SlotProps<T[number]>
  'item-trailing': SlotProps<T[number]>
} & DynamicSlots<T[number], undefined, {
  index: number
  level: number
  expanded: boolean
  ui: Tree['ui']
  selected: boolean
  indeterminate: boolean | undefined
  handleSelect: () => void
  handleToggle: () => void
}>

</script>

<script setup lang="ts" generic="T extends TreeItem[], M extends boolean = false">
import { computed, toRef, useTemplateRef } from 'vue'
import { TreeRoot, TreeItem, TreeVirtualizer, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { defu } from 'defu'
import { useAppConfig } from '#imports'
import { get } from '../utils'
import { getEstimateSize } from '../utils/virtualizer'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TreeProps<T, M>>(), {
  labelKey: 'label',
  nested: true,
  virtualize: false
})
const emits = defineEmits<TreeEmits<T, M>>()
const slots = defineSlots<TreeSlots<T>>()

const appConfig = useAppConfig() as Tree['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'items', 'multiple', 'expanded', 'disabled', 'propagateSelect', 'bubbleSelect'), emits)

const as = computed(() => {
  if (typeof props.as === 'string' || typeof props.as?.render === 'function') {
    return { root: props.as, link: 'button' }
  }

  return defu(props.as, { root: 'ul', link: 'button' })
})

const nested = computed(() => props.virtualize ? false : props.nested)

const flattenedPaddingFormula = computed(() => {
  const sizeConfig = {
    xs: { base: 2, perLevel: 5.5 }, // px-2, ms-4 + ps-1.5
    sm: { base: 2.5, perLevel: 6 }, // px-2.5, ms-4.5 + ps-1.5
    md: { base: 2.5, perLevel: 6.5 }, // px-2.5, ms-5 + ps-1.5
    lg: { base: 3, perLevel: 7 }, // px-3, ms-5.5 + ps-1.5
    xl: { base: 3, perLevel: 7.5 } // px-3, ms-6 + ps-1.5
  }
  const config = sizeConfig[props.size || 'md']
  return (level: number) => `calc(var(--spacing) * ${(level - 1) * config.perLevel + config.base})`
})

const virtualizerProps = toRef(() => {
  if (!props.virtualize) return false

  return defu(typeof props.virtualize === 'boolean' ? {} : props.virtualize, {
    estimateSize: getEstimateSize(props.items || [], props.size || 'md')
  })
})

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items?: TreeItem[], level: number }, TreeSlots<T>>()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: TreeItem, index: number, level: number }, TreeSlots<T>>({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tree || {}) })({
  color: props.color,
  size: props.size,
  virtualize: !!props.virtualize
}))

const rootRef = useTemplateRef<ComponentPublicInstance>('rootRef')

function getItemLabel<Item extends T[number]>(item: Item): string {
  return get(item, props.labelKey as string)
}

function getItemKey<Item extends T[number]>(item: Item): string {
  return props.getKey
    ? props.getKey(item) || getItemLabel(item)
    : getItemLabel(item)
}

function getDefaultOpenedItems(item: T[number]): string[] {
  const currentItem = item.defaultExpanded ? getItemKey(item) : null
  const childItems = item.children?.flatMap((child: T[number]) => getDefaultOpenedItems(child)) ?? []

  return [currentItem, ...childItems].filter(Boolean) as string[]
}

const defaultExpanded = computed(() => props.defaultExpanded ?? props.items?.flatMap(item => getDefaultOpenedItems(item)))

defineExpose({
  get $el() {
    return rootRef.value?.$el as HTMLElement
  }
})
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineItemTemplate v-slot="{ item, index, level }">
    <li
      role="presentation"
      :class="!!nested && level > 1 ? ui.itemWithChildren({ class: [props.ui?.itemWithChildren, item.ui?.itemWithChildren] }) : ui.item({ class: [props.ui?.item, item.ui?.item] })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected, isIndeterminate, handleSelect, handleToggle }"
        :level="level"
        :value="item"
        as-child
        @toggle="(item.onToggle ?? props.onToggle)?.($event, item)"
        @select="(item.onSelect ?? props.onSelect)?.($event, item)"
      >
        <slot
          :name="((item.slot ? `${item.slot}-wrapper` : 'item-wrapper') as keyof TreeSlots<T>)"
          v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
          :item="(item as Extract<T[number], { slot: string; }>)"
        >
          <component
            :is="as.link"
            :type="as.link === 'button' ? 'button' : undefined"
            :disabled="item.disabled || disabled"
            data-slot="link"
            :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], selected: isSelected, disabled: item.disabled || disabled })"
            :style="!nested && level > 1 ? { paddingLeft: flattenedPaddingFormula(level) } : undefined"
          >
            <slot
              :name="((item.slot || 'item') as keyof TreeSlots<T>)"
              v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
              :item="(item as Extract<T[number], { slot: string; }>)"
            >
              <slot
                :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof TreeSlots<T>)"
                v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                :item="(item as Extract<T[number], { slot: string; }>)"
              >
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  data-slot="linkLeadingIcon"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
                <UIcon
                  v-else-if="item.children?.length"
                  :name="isExpanded ? (expandedIcon ?? appConfig.ui.icons.folderOpen) : (collapsedIcon ?? appConfig.ui.icons.folder)"
                  data-slot="linkLeadingIcon"
                  :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
                />
              </slot>

              <span
                v-if="getItemLabel(item) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof TreeSlots<T>]"
                data-slot="linkLabel"
                :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })"
              >
                <slot
                  :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof TreeSlots<T>)"
                  v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                  :item="(item as Extract<T[number], { slot: string; }>)"
                >
                  {{ getItemLabel(item) }}
                </slot>
              </span>

              <span
                v-if="item.trailingIcon || item.children?.length || !!slots[(item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>]"
                data-slot="linkTrailing"
                :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })"
              >
                <slot
                  :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>)"
                  v-bind="{ index, level, expanded: isExpanded, selected: isSelected, indeterminate: isIndeterminate, handleSelect, handleToggle, ui }"
                  :item="(item as Extract<T[number], { slot: string; }>)"
                >
                  <UIcon
                    v-if="item.trailingIcon"
                    :name="item.trailingIcon"
                    data-slot="linkTrailingIcon"
                    :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                  <UIcon
                    v-else-if="item.children?.length"
                    :name="trailingIcon ?? appConfig.ui.icons.chevronDown"
                    data-slot="linkTrailingIcon"
                    :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })"
                  />
                </slot>
              </span>
            </slot>
          </component>
        </slot>

        <ul
          v-if="nested && item.children?.length && isExpanded"
          role="group"
          data-slot="listWithChildren"
          :class="ui.listWithChildren({ class: [props.ui?.listWithChildren, item.ui?.listWithChildren] })"
        >
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineItemTemplate>

  <DefineTreeTemplate v-slot="{ items, level }">
    <ReuseItemTemplate v-for="(item, index) in items" :key="`${level}-${index}`" :item="item" :index="index" :level="level" />
  </DefineTreeTemplate>

  <TreeRoot
    ref="rootRef"
    v-slot="{ flattenItems }"
    v-bind="{ ...rootProps, ...$attrs }"
    :as="as.root"
    :model-value="modelValue"
    :default-value="defaultValue"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :get-key="getItemKey"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <TreeVirtualizer
      v-if="!!virtualize"
      v-slot="{ item, virtualItem }"
      :text-content="item => getItemLabel(item.value)"
      v-bind="virtualizerProps"
    >
      <ReuseItemTemplate :item="item.value" :index="virtualItem.index" :level="item.level" />
    </TreeVirtualizer>

    <template v-else-if="!nested">
      <ReuseItemTemplate
        v-for="(item, index) in flattenItems"
        :key="item._id"
        :item="item.value"
        :index="index"
        :level="item.level"
      />
    </template>

    <ReuseTreeTemplate v-else :items="items" :level="1" />
  </TreeRoot>
</template>
