<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/dropdown-menu'
import type { AvatarProps, IconProps, KbdProps, LinkProps } from '#ui/types'

const appConfig = _appConfig as AppConfig & { ui: { dropdownMenu: Partial<typeof theme> } }

const dropdownMenu = tv({ extend: tv(theme), ...(appConfig.ui?.dropdownMenu || {}) })

export interface DropdownMenuItem extends Omit<LinkProps, 'type'> {
  label?: string
  icon?: IconProps['name']
  avatar?: AvatarProps
  disabled?: boolean
  content?: Omit<DropdownMenuContentProps, 'asChild' | 'forceMount'>
  shortcuts?: string[] | KbdProps[]
  /**
   * The item type.
   * @defaultValue "link"
   */
  type?: 'label' | 'link'
  slot?: string
  open?: boolean
  defaultOpen?: boolean
  select? (e: Event): void
  children?: DropdownMenuItem[] | DropdownMenuItem[][]
}

export interface DropdownMenuProps<T> extends Omit<DropdownMenuRootProps, 'dir'> {
  items?: T[] | T[][]
  disabled?: boolean
  content?: Omit<DropdownMenuContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<DropdownMenuArrowProps, 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof dropdownMenu.slots>
}

export interface DropdownMenuEmits extends DropdownMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean, index: number }) => any

export interface DropdownMenuSlots<T> {
  default(): any
  leading: SlotProps<T>
  label: SlotProps<T>
  trailing: SlotProps<T>
  item: SlotProps<T>
  [key: string]: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UDropdownMenuContent } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
  portal: true,
  modal: false
})
const emits = defineEmits<DropdownMenuEmits>()
const slots = defineSlots<DropdownMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => props.arrow as DropdownMenuArrowProps)
const proxySlots = omit(slots, ['default'])

const ui = computed(() => tv({ extend: dropdownMenu, slots: props.ui })())
</script>

<template>
  <DropdownMenuRoot v-bind="rootProps">
    <DropdownMenuTrigger v-if="$slots.default" as-child :disabled="disabled">
      <slot />
    </DropdownMenuTrigger>

    <UDropdownMenuContent :class="ui.content({ class: props.class })" :ui="ui" v-bind="contentProps" :items="items" :portal="portal">
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>

      <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
