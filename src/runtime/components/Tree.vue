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
  ui?: Pick<Tree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon'>
  [key: string]: any
}

export interface TreeProps<T extends TreeItem = TreeItem, VK extends GetItemKeys<T> = 'value', M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
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
  labelKey?: keyof T
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
  items?: T[]
  /** The controlled value of the Tree. Can be bind as `v-model`. */
  modelValue?: GetModelValue<T, VK, M>
  /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
  defaultValue?: GetModelValue<T, VK, M>
  /** Whether multiple options can be selected or not. */
  multiple?: M & boolean
  class?: any
  ui?: Tree['slots']
}

export type TreeEmits<T extends TreeItem, VK extends GetItemKeys<T[]> | undefined, M extends boolean> = Omit<TreeRootEmits, 'update:modelValue'> & GetModelValueEmits<T[], VK, M>

type SlotProps<T extends TreeItem> = (props: { item: NestedItem<T>, index: number, level: number, expanded: boolean, selected: boolean }) => any

export type TreeSlots<
  A extends TreeItem = TreeItem,
  T extends NestedItem<A[]> = NestedItem<A[]>
> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, undefined, { index: number, level: number, expanded: boolean, selected: boolean }>

</script>

<script setup lang="ts" generic="T extends TreeItem, VK extends GetItemKeys<T> = 'value', M extends boolean = false">
import { computed } from 'vue'
import { TreeRoot, useForwardPropsEmits, TreeItem as TreeItemReka } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
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

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.tree || {}) })({
  color: props.color,
  size: props.size
}))

function getItemLabel(item: T): string {
  return get(item, props.labelKey as string)
}

function getItemValue(item: T): string {
  return get(item, props.valueKey as string) ?? get(item, props.labelKey as string)
}

function getDefaultOpenedItems(item: T): string[] {
  const currentItem = item.defaultExpanded ? getItemValue(item) : null
  const childItems = item.children?.flatMap(value => getDefaultOpenedItems(value as unknown as T)) ?? []

  return [currentItem, ...childItems].filter(Boolean) as string[]
}

const indent = computed(() => {
  switch (props.size) {
    case 'xl':
    case 'lg':
      return '24px'
    case 'md':
    case 'sm':
      return '20px'
    case 'xs':
      return '16px'
    default:
      return '20px'
  }
})

const defaultExpanded = computed(() =>
  props.defaultExpanded ?? props.items?.flatMap(item => getDefaultOpenedItems(item as NestedItem<T>))
)
</script>

<template>
  <TreeRoot
    v-slot="{ flattenItems }"
    v-bind="{ ...(rootProps as unknown as TreeRootProps<T>), ...$attrs }"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :get-key="getItemValue"
    :get-children="(v) => (v.children as unknown as T[])"
    :items="items"
    :default-expanded="defaultExpanded"
    :selection-behavior="selectionBehavior"
  >
    <li
      v-for="(item, index) in flattenItems"
      :key="item._id"
      class="tree-item"
      :class="item.level > 0 ? [ui.itemWithChildren({ class: [props.ui?.itemWithChildren, item.value.ui?.itemWithChildren] }), 'tree--indent'] : ui.item({ class: [props.ui?.item, item.value.ui?.item] })"
      :style="{
        '--level': item.level - 1,
        '--line-offset': ui.lineOffset(),
        '--indent': indent
      }"
    >
      <TreeItemReka
        v-slot="{ isExpanded, isSelected }"
        as-child
        v-bind="item.bind"
        @toggle="item.value.onToggle"
        @select="item.value.onSelect"
      >
        <button type="button" :disabled="item.value.disabled || disabled" :class="ui.link({ class: [props.ui?.link, item.value.ui?.link, item.value.class], selected: isSelected, disabled: item.value.disabled || disabled })">
          <slot :name="((item.value.slot || 'item') as keyof TreeSlots<T>)" v-bind="{ index, level: item.level, expanded: isExpanded, selected: isSelected }" :item="(item.value as Extract<T, { slot: string; }>)">
            <slot :name="((item.value.slot ? `${item.value.slot}-leading`: 'item-leading') as keyof TreeSlots<T>)" v-bind="{ index, level: item.level, expanded: isExpanded, selected: isSelected }" :item="(item.value as Extract<T, { slot: string; }>)">
              <UIcon
                v-if="item.value.icon"
                :name="item.value.icon"
                :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.value.ui?.linkLeadingIcon] })"
              />
              <UIcon
                v-else-if="item.value.children?.length"
                :name="isExpanded ? (expandedIcon ?? appConfig.ui.icons.folderOpen) : (collapsedIcon ?? appConfig.ui.icons.folder)"
                :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.value.ui?.linkLeadingIcon] })"
              />
            </slot>

            <span v-if="getItemLabel(item.value) || !!slots[(item.value.slot ? `${item.value.slot}-label`: 'item-label') as keyof TreeSlots<T>]" :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.value.ui?.linkLabel] })">
              <slot :name="((item.value.slot ? `${item.value.slot}-label`: 'item-label') as keyof TreeSlots<T>)" v-bind="{ item, index, level: item.level, expanded: isExpanded, selected: isSelected }" :item="(item.value as Extract<T, { slot: string; }>)">
                {{ getItemLabel(item.value) }}
              </slot>
            </span>

            <span v-if="item.value.trailingIcon || item.value.children?.length || !!slots[(item.value.slot ? `${item.value.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>]" :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.value.ui?.linkTrailing] })">
              <slot :name="((item.value.slot ? `${item.value.slot}-trailing`: 'item-trailing') as keyof TreeSlots<T>)" v-bind="{ item, index, level: item.level, expanded: isExpanded, selected: isSelected }" :item="(item.value as Extract<T, { slot: string; }>)">
                <UIcon v-if="item.value.trailingIcon" :name="item.value.trailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.value.ui?.linkTrailingIcon] })" />
                <UIcon v-else-if="item.value.children?.length" :name="trailingIcon ?? appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.value.ui?.linkTrailingIcon] })" />
              </slot>
            </span>
          </slot>
        </button>
      </TreeItemReka>
    </li>
  </TreeRoot>
</template>

<style lang="css" scoped>
.tree-item {
  position: relative;
}

.tree-item::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--line-offset);
  pointer-events: none;
  width: calc(var(--level) * (var(--indent) + 0.25em));
  background-image: repeating-linear-gradient(
    to right,
    transparent,
    transparent calc(50% - 0.5px),
    #e2e8f0 calc(50% - 0.5px),
    #e2e8f0 calc(50% + 0.5px),
    transparent calc(50% + 0.5px)
  );

  background-size: calc(var(--indent) + 0.25em) 100%;

}
</style>
