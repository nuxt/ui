<script lang="ts">
import { tv } from 'tailwind-variants'
import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuArrowProps, ContextMenuTriggerProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/context-menu'
import type { AvatarProps, KbdProps, LinkProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { contextMenu: Partial<typeof theme> } }

const contextMenu = tv({ extend: tv(theme), ...(appConfig.ui?.contextMenu || {}) })

export interface ContextMenuItem extends Omit<LinkProps, 'type'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  content?: Omit<ContextMenuContentProps, 'asChild' | 'forceMount'>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue `'link'`
   */
  type?: 'label' | 'separator' | 'link'
  slot?: string
  open?: boolean
  defaultOpen?: boolean
  children?: ContextMenuItem[] | ContextMenuItem[][]
  select? (e: Event): void
}

export interface ContextMenuProps<T> extends Omit<ContextMenuRootProps, 'dir'>, Pick<ContextMenuTriggerProps, 'disabled'> {
  items?: T[] | T[][]
  content?: Omit<ContextMenuContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<ContextMenuArrowProps, 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof contextMenu.slots>
}

export interface ContextMenuEmits extends ContextMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean, index: number }) => any

export type ContextMenuSlots<T extends { slot?: string }> = {
  default(): any
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends ContextMenuItem">
import { computed, toRef } from 'vue'
import { ContextMenuRoot, ContextMenuTrigger, ContextMenuArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UContextMenuContent } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<ContextMenuProps<T>>(), {
  portal: true,
  modal: false
})
const emits = defineEmits<ContextMenuEmits>()
const slots = defineSlots<ContextMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'modal'), emits)
const contentProps = toRef(() => props.content as ContextMenuContentProps)
const arrowProps = toRef(() => props.arrow as ContextMenuArrowProps)
const proxySlots = omit(slots, ['default']) as Record<string, ContextMenuSlots<T>[string]>

const ui = computed(() => tv({ extend: contextMenu, slots: props.ui })())
</script>

<template>
  <ContextMenuRoot v-bind="rootProps">
    <ContextMenuTrigger v-if="$slots.default" as-child :disabled="disabled">
      <slot />
    </ContextMenuTrigger>

    <UContextMenuContent :class="ui.content({ class: props.class })" :ui="ui" v-bind="contentProps" :items="items" :portal="portal">
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>

      <ContextMenuArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
    </UContextMenuContent>
  </ContextMenuRoot>
</template>
