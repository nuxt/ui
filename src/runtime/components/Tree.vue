<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { TreeRootProps, TreeRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/tree'
import type { DynamicSlots, GetItemKeys, GetModelValue, GetModelValueEmits, NestedItem, ComponentConfig } from '../types/utils'

type Tree = ComponentConfig<typeof theme, AppConfig, 'tree'>

export type TreeItem = {
  /**
   * @IconifyIcon
   */
  icon?: string
  label?: string
  /**
   * @IconifyIcon
   */
  trailingIcon?: string
  defaultExpanded?: boolean
  disabled?: boolean
  value?: string
  slot?: string
  children?: TreeItem[]
  onToggle?(e: Event): void
  onSelect?(e?: Event): void
  class?: any
  ui?: Pick<Tree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon' | 'listWithChildren'>
  [key: string]: any
}

export interface TreeProps<T extends TreeItem[] = TreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'ul'
   */
  as?: any
  /**
   * @defaultValue 'primary'
   */
  color?: Tree['variants']['color']
  /**
   * @defaultValue 'md'
   */
  size?: Tree['variants']['size']
  /**
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: VK
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>
  /**
   * The icon displayed on the right side of a parent node.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The icon displayed when a parent node is expanded.
   * @defaultValue appConfig.ui.icons.folderOpen
   * @IconifyIcon
   */
  expandedIcon?: string
  /**
   * The icon displayed when a parent node is collapsed.
   * @defaultValue appConfig.ui.icons.folder
   * @IconifyIcon
   */
  collapsedIcon?: string
  items?: T
  /** The controlled value of the Tree. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
  defaultValue?: GetModelValue<T, VK, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  class?: any
  ui?: Tree['slots']
}

export type TreeEmits<A extends TreeItem[], VK extends GetItemKeys<A> | undefined, M extends boolean> = Omit<TreeRootEmits, 'update:modelValue'> & GetModelValueEmits<A, VK, M>

type SlotProps<T extends TreeItem> = (props: { item: T, index: number, level: number, expanded: boolean, selected: boolean }) => any

export type TreeSlots<
  A extends TreeItem[] = TreeItem[],
  T extends NestedItem<A> = NestedItem<A>
> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, undefined, { index: number, level: number, expanded: boolean, selected: boolean }>

</script>

<script setup lang="ts" generic="T extends TreeItem[], VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import { computed } from 'vue'
import { TreeRoot, TreeItem, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { get } from '../utils'
import { tv } from '../utils/tv'
import UIcon from './Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<TreeProps<T, VK, M>>(), {
  labelKey: 'label' as never,
  valueKey: 'value' as never
})
const emits = defineEmits<TreeEmits<T, VK, M>>()
const slots = defineSlots<TreeSlots<T>>()

const appConfig = useAppConfig() as Tree['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'items', 'multiple', 'expanded', 'disabled', 'propagateSelect', 'bubbleSelect'), emits)

const [DefineTreeTemplate, ReuseTreeTemplate] = createReusableTemplate<{ items?: TreeItem[], level: number }, TreeSlots<T>>()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tree || {}) })({
  color: props.color,
  size: props.size
}))

function getItemLabel<Item extends TreeItem = NestedItem<T>>(item: Item): string {
  return get(item, props.labelKey as string)
}

function getItemValue(item: NestedItem<T>): string {
  return get(item, props.valueKey as string) ?? get(item, props.labelKey as string)
}

function getDefaultOpenedItems(item: NestedItem<T>): string[] {
  const currentItem = item.defaultExpanded ? getItemValue(item) : null
  const childItems = item.children?.flatMap((child: TreeItem) => getDefaultOpenedItems(child as NestedItem<T>)) ?? []

  return [currentItem, ...childItems].filter(Boolean) as string[]
}

const defaultExpanded = computed(() =>
  props.defaultExpanded ?? props.items?.flatMap(item => getDefaultOpenedItems(item as NestedItem<T>))
)
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <DefineTreeTemplate v-slot="{ items, level }">
    <li
      v-for="(item, index) in items"
      :key="`${level}-${index}`"
      :class="level > 0 ? ui.itemWithChildren({ class: [props.ui?.itemWithChildren, item.ui?.itemWithChildren] }) : ui.item({ class: [props.ui?.item, item.ui?.item] })"
    >
      <TreeItem
        v-slot="{ isExpanded, isSelected }"
        as-child
        :level="level"
        :value="item"
        @toggle="item.onToggle"
        @select="item.onSelect"
      >
        <button type="button" :disabled="item.disabled || disabled" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], selected: isSelected, disabled: item.disabled || disabled })">
          <slot :name="((item.slot || 'item') as keyof TreeSlots<T>)" v-bind="{ index, level, expanded: isExpanded, selected: isSelected }" :item="(item as Extract<NestedItem<T>, { slot: string; }>)">
            <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof TreeSlots<T>)" v-bind="{ index, level, expanded: isExpanded, selected: isSelected }" :item="(item as Extract<NestedItem<T>, { slot: string; }>)">
              <UIcon
                v-if="item.icon"
                :name="item.icon"
                :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
              />
              <UIcon
                v-else-if="item.children?.length"
                :name="isExpanded ? (expandedIcon ?? appConfig.ui.icons.folderOpen) : (collapsedIcon ?? appConfig.ui.icons.folder)"
                :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon] })"
              />
            </slot>

            <span v-if="getItemLabel(item) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof TreeSlots<T>]" :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })">
              <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof TreeSlots<T>)" v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }" :item="(item as Extract<NestedItem<T>, { slot: string; }>)">
                {{ getItemLabel(item) }}
              </slot>
            </span>

            <span v-if="item.trailingIcon || item.children?.length || !!slots[(item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>]" :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })">
              <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>)" v-bind="{ item, index, level, expanded: isExpanded, selected: isSelected }" :item="(item as Extract<NestedItem<T>, { slot: string; }>)">
                <UIcon v-if="item.trailingIcon" :name="item.trailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })" />
                <UIcon v-else-if="item.children?.length" :name="trailingIcon ?? appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon] })" />
              </slot>
            </span>
          </slot>
        </button>

        <ul v-if="item.children?.length && isExpanded" :class="ui.listWithChildren({ class: [props.ui?.listWithChildren, item.ui?.listWithChildren] })">
          <ReuseTreeTemplate :items="item.children" :level="level + 1" />
        </ul>
      </TreeItem>
    </li>
  </DefineTreeTemplate>

  <TreeRoot
    v-bind="{ ...(rootProps as unknown as TreeRootProps<NestedItem<T>>), ...$attrs }"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :get-key="getItemValue"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <ReuseTreeTemplate :items="items" :level="0" />
  </TreeRoot>
</template>
