<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { TreeRootProps, TreeRootEmits } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/tree'
import type { AvatarProps, ChipProps } from '../types'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { tree: Partial<typeof theme> } }

const tree = tv({ extend: tv(theme), ...(appConfig.ui?.tree || {}) })

type TreeVariants = VariantProps<typeof tree>

export interface TreeItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  disabled?: boolean
  slot?: string
  children?: TreeItem[]
}

export interface TreeProps<T> extends Omit<TreeRootProps<T>, 'dir'> {
  size?: TreeVariants['size']
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  /**
   * The icon displayed when an item is selected.
   * @defaultValue appConfig.ui.icons.check
   */
  selectedIcon?: string
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  ui?: Partial<typeof tree.slots>
}

export interface TreeEmits extends TreeRootEmits {}

type SlotProps<T> = (props: { item: T, index: number, level: number, hasChildren: boolean }) => any

export type TreeSlots<T extends { slot?: string }> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends TreeItem">
import { computed } from 'vue'
import { TreeRoot, TreeItem as TreeItemComponent, useForwardPropsEmits } from 'radix-vue'
import { reactiveOmit, createReusableTemplate } from '@vueuse/core'
import { get } from '../utils'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'

const props = withDefaults(defineProps<TreeProps<T>>(), {
  labelKey: 'label'
})
const emits = defineEmits<TreeEmits>()
const slots = defineSlots<TreeSlots<T>>()

const rootProps = useForwardPropsEmits(reactiveOmit(props, 'class', 'ui'), emits)

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: TreeItem, index: number, level: number, hasChildren: boolean }>()

const ui = computed(() => tree({
  size: props.size,
}))
</script>

<template>
  <DefineItemTemplate v-slot="{ item, index, level, hasChildren }">
    <slot :name="item.slot || 'item'" v-bind="{ item: item as T, index, level, hasChildren }">
      <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" v-bind="{ item: item as T, index, level, hasChildren }">
        <UIcon v-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
        <UAvatar v-else-if="item.avatar" v-bind="item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
      </slot>

      <span v-if="get(item, props.labelKey) || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.itemLabel({ class: props.ui?.itemLabel })">
        <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" v-bind="{ item: item as T, index, level, hasChildren }">
          {{ get(item, props.labelKey) }}
        </slot>
      </span>

      <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
        <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" v-bind="{ item: item as T, index, level, hasChildren }" />
<!--        <UIcon :name="selectedIcon || appConfig.ui.icons.check" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />-->
      </span>
    </slot>
  </DefineItemTemplate>

  <TreeRoot v-slot="{ flattenItems }" v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })" :get-key="(item) => item.label">
    <TreeItemComponent
      v-for="item in flattenItems"
      v-bind="item.bind"
      :key="item._id"
      :class="ui.item({ class: [props.ui?.item] })"
      :style="{ 'padding-left': `${item.level - 0.5}rem` }"
      :data-disabled="item.value.disabled ? 'true' : undefined"
    >
      <ReuseItemTemplate :item="item.value" :index="item.index" :level="item.level" :has-children="item.hasChildren" />
    </TreeItemComponent>
  </TreeRoot>
</template>
