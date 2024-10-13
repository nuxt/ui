<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuArrowProps, DropdownMenuTriggerProps, DropdownMenuItemProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/dropdown-menu'
import type { AvatarProps, KbdProps, LinkProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'
import { extendComponentMeta } from '../../devtools/extendComponentMeta'

const appConfig = _appConfig as AppConfig & { ui: { dropdownMenu: Partial<typeof theme> } }

const dropdownMenu = tv({ extend: tv(theme), ...(appConfig.ui?.dropdownMenu || {}) })

export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'>, Pick<DropdownMenuItemProps, 'disabled'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  kbds?: KbdProps['value'][] | KbdProps[]
  /**
   * The item type.
   * @defaultValue 'link'
   */
  type?: 'label' | 'separator' | 'link'
  slot?: string
  open?: boolean
  defaultOpen?: boolean
  children?: DropdownMenuItem[] | DropdownMenuItem[][]
  select?(e: Event): void
}

type DropdownMenuVariants = VariantProps<typeof dropdownMenu>

export interface DropdownMenuProps<T> extends Omit<DropdownMenuRootProps, 'dir'>, Pick<DropdownMenuTriggerProps, 'disabled'> {
  size?: DropdownMenuVariants['size']
  items?: T[] | T[][]
  /**
   * The content of the menu.
   * @defaultValue { side: 'bottom', sideOffset: 8 }
   */
  content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean | Omit<DropdownMenuArrowProps, 'as' | 'asChild'>
  /**
   * Render the menu in a portal.
   * @defaultValue true
   */
  portal?: boolean
  class?: any
  ui?: PartialString<typeof dropdownMenu.slots>
}

export interface DropdownMenuEmits extends DropdownMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active?: boolean, index: number }) => any

export type DropdownMenuSlots<T extends { slot?: string }> = {
  'default'(props: { open: boolean }): any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>

extendComponentMeta({
  example: 'DropdownMenuExample',
  defaultProps: {
    items: [
      [{
        label: 'My account',
        avatar: {
          src: 'https://avatars.githubusercontent.com/u/739984?v=4'
        },
        type: 'label'
      }],
      [{
        label: 'Profile',
        icon: 'i-heroicons-user',
        slot: 'custom'
      }, {
        label: 'Billing',
        icon: 'i-heroicons-credit-card',
        kbds: ['meta', 'b']
      }, {
        label: 'Settings',
        icon: 'i-heroicons-cog',
        kbds: ['?']
      }], [{
        label: 'Team',
        icon: 'i-heroicons-users'
      }, {
        label: 'Invite users',
        icon: 'i-heroicons-user-plus',
        children: [[{
          label: 'Invite by email',
          icon: 'i-heroicons-paper-airplane'
        }, {
          label: 'Invite by link',
          icon: 'i-heroicons-link',
          kbds: ['meta', 'i']
        }], [{
          label: 'More',
          icon: 'i-heroicons-plus-circle',
          children: [{
            label: 'Import from Slack',
            icon: 'i-simple-icons-slack',
            to: 'https://slack.com',
            target: '_blank'
          }, {
            label: 'Import from Trello',
            icon: 'i-simple-icons-trello'
          }, {
            label: 'Import from Asana',
            icon: 'i-simple-icons-asana'
          }]
        }]]
      }, {
        label: 'New team',
        icon: 'i-heroicons-plus',
        kbds: ['meta', 'n']
      }],
      [{
        label: 'GitHub',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      }, {
        label: 'Support',
        icon: 'i-heroicons-lifebuoy',
        to: '/components/dropdown-menu'
      }, {
        type: 'separator'
      }, {
        label: 'Keyboard Shortcuts',
        icon: 'i-heroicons-key'
      }, {
        label: 'API',
        icon: 'i-heroicons-cube',
        disabled: true
      }], [{
        label: 'Logout',
        icon: 'i-heroicons-arrow-right-start-on-rectangle',
        kbds: ['shift', 'meta', 'q']
      }]
    ] }
})
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import UDropdownMenuContent from './DropdownMenuContent.vue'
import { omit } from '../utils'

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), {
  portal: true,
  modal: true
})
const emits = defineEmits<DropdownMenuEmits>()
const slots = defineSlots<DropdownMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => props.arrow as DropdownMenuArrowProps)
const proxySlots = omit(slots, ['default']) as Record<string, DropdownMenuSlots<T>[string]>

const ui = computed(() => dropdownMenu({
  size: props.size
}))
</script>

<template>
  <DropdownMenuRoot v-slot="{ open }" v-bind="rootProps">
    <DropdownMenuTrigger v-if="!!slots.default" as-child :disabled="disabled">
      <slot :open="open" />
    </DropdownMenuTrigger>

    <UDropdownMenuContent
      :class="ui.content({ class: [props.class, props.ui?.content] })"
      :ui="ui"
      :ui-override="props.ui"
      v-bind="contentProps"
      :items="items"
      :portal="portal"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData: any">
        <slot :name="name" v-bind="slotData" />
      </template>

      <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
