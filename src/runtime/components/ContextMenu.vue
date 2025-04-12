<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuContentEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/context-menu'
import type { AvatarProps, KbdProps, LinkProps } from '../types'
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils'

type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>

export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  color?: ContextMenu['variants']['color']
  avatar?: AvatarProps
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue 'link'
   */
  type?: 'label' | 'separator' | 'link' | 'checkbox'
  slot?: string
  loading?: boolean
  disabled?: boolean
  checked?: boolean
  open?: boolean
  defaultOpen?: boolean
  children?: ArrayOrNested<ContextMenuItem>
  onSelect?(e: Event): void
  onUpdateChecked?(checked: boolean): void
  [key: string]: any
}

export interface ContextMenuProps<T extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>> extends Omit<ContextMenuRootProps, 'dir'> {
  /**
   * @defaultValue 'md'
   */
  size?: ContextMenu['variants']['size']
  items?: T
  /**
   * The icon displayed when an item is checked.
   * @defaultValue appConfig.ui.icons.check
   * @IconifyIcon
   */
  checkedIcon?: string
  /**
   * The icon displayed when an item is loading.
   * @defaultValue appConfig.ui.icons.loading
   * @IconifyIcon
   */
  loadingIcon?: string
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.ui.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | string
  /** The content of the menu. */
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>
  disabled?: boolean
  class?: any
  ui?: ContextMenu['slots']
}

export interface ContextMenuEmits extends ContextMenuRootEmits {}

type SlotProps<T extends ContextMenuItem> = (props: { item: T, active?: boolean, index: number }) => any

export type ContextMenuSlots<
  A extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  'default'(props?: {}): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing', { active?: boolean, index: number }>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<ContextMenuItem>">
import { computed, toRef } from 'vue'
import { ContextMenuRoot, ContextMenuTrigger, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UContextMenuContent from './ContextMenuContent.vue'

const props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  portal: true,
  modal: true,
  externalIcon: true,
  labelKey: 'label'
})
const emits = defineEmits<ContextMenuEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const appConfig = useAppConfig() as ContextMenu['AppConfig']

const rootProps = useForwardPropsEmits(reactivePick(props, 'modal'), emits)
const contentProps = toRef(() => props.content)
const proxySlots = omit(slots, ['default'])

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contextMenu || {}) })({
  size: props.size
}))
</script>

<template>
  <ContextMenuRoot v-bind="rootProps">
    <ContextMenuTrigger v-if="!!slots.default" as-child :disabled="disabled" :class="props.class">
      <slot />
    </ContextMenuTrigger>

    <UContextMenuContent
      :class="ui.content({ class: [!slots.default && props.class, props.ui?.content] })"
      :ui="ui"
      :ui-override="props.ui"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
      :label-key="(labelKey as keyof NestedItem<T>)"
      :checked-icon="checkedIcon"
      :loading-icon="loadingIcon"
      :external-icon="externalIcon"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData">
        <slot :name="(name as keyof ContextMenuSlots<T>)" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
