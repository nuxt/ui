<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/context-menu'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, KbdProps, LinkProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { contextMenu: Partial<typeof theme> } }

const contextMenu = tv({ extend: tv(theme), ...(appConfig.ui?.contextMenu || {}) })

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
   */
  checkedIcon?: string
  /**
   * The icon displayed when an item is loading.
   * @defaultValue appConfig.ui.icons.loading
   */
  loadingIcon?: string
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

extendDevtoolsMeta({
  example: 'ContextMenuExample',
  ignoreProps: ['items'],
  defaultProps: {
    items: [
      [{
        label: 'My account',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/739984?v=4'
        }
      }],
      [{
        label: 'Appearance',
        children: [{
          label: 'System',
          icon: 'i-lucide-monitor'
        }, {
          label: 'Light',
          icon: 'i-lucide-sun'
        }, {
          label: 'Dark',
          icon: 'i-lucide-moon'
        }]
      }],
      [{
        label: 'Show Sidebar',
        kbds: ['meta', 'S']
      }, {
        label: 'Show Toolbar',
        kbds: ['shift', 'meta', 'D']
      }, {
        label: 'Collapse Pinned Tabs',
        disabled: true
      }], [{
        label: 'Refresh the Page'
      }, {
        label: 'Clear Cookies and Refresh'
      }, {
        label: 'Clear Cache and Refresh'
      }, {
        type: 'separator'
      }, {
        label: 'Developer',
        children: [[{
          label: 'View Source',
          kbds: ['option', 'meta', 'U']
        }, {
          label: 'Developer Tools',
          kbds: ['option', 'meta', 'I']
        }], [{
          label: 'Inspect Elements',
          kbds: ['option', 'meta', 'C']
        }], [{
          label: 'JavaScript Console',
          kbds: ['option', 'meta', 'J']
        }]]
      }]
    ]
  }
})
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
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
