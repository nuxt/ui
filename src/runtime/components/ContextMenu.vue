<script lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/context-menu'
import { tv } from '../utils/tv'
import type { AvatarProps, KbdProps, LinkProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfigContextMenu = _appConfig as AppConfig & { ui: { contextMenu: Partial<typeof theme> } }

const contextMenu = tv({ extend: tv(theme), ...(appConfigContextMenu.ui?.contextMenu || {}) })

type ContextMenuVariants = VariantProps<typeof contextMenu>

export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string
  icon?: string
  color?: ContextMenuVariants['color']
  avatar?: AvatarProps
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'>
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
  children?: ContextMenuItem[] | ContextMenuItem[][]
  onSelect?(e: Event): void
  onUpdateChecked?(checked: boolean): void
}

export interface ContextMenuProps<T> extends Omit<ContextMenuRootProps, 'dir'> {
  size?: ContextMenuVariants['size']
  items?: T[] | T[][]
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
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  disabled?: boolean
  class?: any
  ui?: PartialString<typeof contextMenu.slots>
}

export interface ContextMenuEmits extends ContextMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean, index: number }) => any

export type ContextMenuSlots<T extends { slot?: string }> = {
  'default'(props?: {}): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends ContextMenuItem">
import { computed, toRef } from 'vue'
import { ContextMenuRoot, ContextMenuTrigger, useForwardPropsEmits } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { omit } from '../utils'
import UContextMenuContent from './ContextMenuContent.vue'

const props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  portal: true,
  modal: true,
  externalIcon: true,
  labelKey: 'label'
})
const emits = defineEmits<ContextMenuEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'modal'), emits)
const contentProps = toRef(() => props.content as ContextMenuContentProps)
const proxySlots = omit(slots, ['default']) as Record<string, ContextMenuSlots<T>[string]>

const ui = computed(() => contextMenu({
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
      :label-key="labelKey"
      :checked-icon="checkedIcon"
      :loading-icon="loadingIcon"
      :external-icon="externalIcon"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
