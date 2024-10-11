<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuTriggerProps, ContextMenuItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/context-menu'
import type { AvatarProps, KbdProps, LinkProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { contextMenu: Partial<typeof theme> } }

const contextMenu = tv({ extend: tv(theme), ...(appConfig.ui?.contextMenu || {}) })

export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'>, Pick<ContextMenuItemProps, 'disabled'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue 'link'
   */
  type?: 'label' | 'separator' | 'link'
  slot?: string
  open?: boolean
  defaultOpen?: boolean
  children?: ContextMenuItem[] | ContextMenuItem[][]
  select?(e: Event): void
}

type ContextMenuVariants = VariantProps<typeof contextMenu>

export interface ContextMenuProps<T> extends Omit<ContextMenuRootProps, 'dir'>, Pick<ContextMenuTriggerProps, 'disabled'> {
  size?: ContextMenuVariants['size']
  items?: T[] | T[][]
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
import { ContextMenuRoot, ContextMenuTrigger, useForwardPropsEmits } from 'radix-vue'
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
    <ContextMenuTrigger v-if="!!slots.default" as-child :disabled="disabled">
      <slot />
    </ContextMenuTrigger>

    <UContextMenuContent
      :class="ui.content({ class: [props.class, props.ui?.content] })"
      :ui="ui"
      :ui-override="props.ui"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
      :label-key="labelKey"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
