<script lang="ts">
import { tv } from 'tailwind-variants'
import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuArrowProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/dropdownMenu'
import type { LinkProps } from '#ui/components/Link.vue'
import type { AvatarProps } from '#ui/components/Avatar.vue'
import type { IconProps } from '#ui/components/Icon.vue'
import type { KbdProps } from '#ui/components/Kbd.vue'

const appConfig = _appConfig as AppConfig & { ui: { dropdownMenu: Partial<typeof theme> } }

const dropdownMenu = tv({ extend: tv(theme), ...(appConfig.ui?.dropdownMenu || {}) })

export interface DropdownMenuItem extends LinkProps {
  label?: string
  icon?: IconProps['name']
  avatar?: AvatarProps
  disabled?: boolean
  shortcuts?: string[] | KbdProps[]
  slot?: string
  select? (e: Event): void
}

export interface DropdownMenuProps<T extends DropdownMenuItem> extends Omit<DropdownMenuRootProps, 'dir'> {
  items?: T[] | T[][]
  disabled?: boolean
  content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<DropdownMenuArrowProps, 'as' | 'asChild'>
  portal?: boolean
  class?: any
  ui?: Partial<typeof dropdownMenu.slots>
}

export interface DropdownMenuEmits extends DropdownMenuRootEmits {}

type SlotProps<T> = (props: { item: T, active: boolean }) => any

export interface DropdownMenuSlots<T extends DropdownMenuItem> {
  default (): any
  leading: SlotProps<T>
  label: SlotProps<T>
  shortcuts: SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends DropdownMenuItem">
import { computed, toRef } from 'vue'
import { defu } from 'defu'
import { DropdownMenuRoot, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuArrow, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UIcon, UAvatar, ULink, ULinkBase } from '#components'
import { omit } from '#ui/utils'

const props = withDefaults(defineProps<DropdownMenuProps<T>>(), { modal: false })
const emits = defineEmits<DropdownMenuEmits>()
defineSlots<DropdownMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'defaultOpen', 'open', 'modal'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8 }) as DropdownMenuContentProps)
const arrowProps = toRef(() => props.arrow as DropdownMenuArrowProps)

const ui = computed(() => tv({ extend: dropdownMenu, slots: props.ui })())

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <DropdownMenuRoot v-bind="rootProps">
    <DropdownMenuTrigger v-if="$slots.default" as-child :disabled="disabled">
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal :disabled="!portal">
      <DropdownMenuContent :class="ui.content({ class: props.class })" v-bind="contentProps">
        <DropdownMenuGroup v-for="(group, index) in groups" :key="`group-${index}`" :class="ui.group()">
          <DropdownMenuItem v-for="(item, itemIndex) in group" :key="`group-${index}-${itemIndex}`" :disabled="item.disabled" as-child @select="item.select">
            <ULink v-slot="{ active, ...slotProps }" v-bind="omit(item, ['label', 'icon', 'avatar', 'disabled', 'shortcuts', 'slot', 'select'])" :disabled="item.disabled" custom>
              <ULinkBase v-bind="slotProps" :class="ui.base({ active })">
                <slot name="leading" :item="item" :active="active">
                  <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.avatar({ active })" />
                  <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.icon({ active })" />
                </slot>

                <span v-if="item.label || $slots.default" :class="ui.label()">
                  <slot name="label" :item="item" :active="active">
                    {{ item.label }}
                  </slot>
                </span>

                <span v-if="item.shortcuts?.length" :class="ui.shortcuts()">
                  <slot name="shortcuts" :item="item" :active="active">
                    <UKbd v-for="(shortcut, shortcutIndex) in item.shortcuts" :key="shortcutIndex" size="sm" v-bind="typeof shortcut === 'string' ? { value: shortcut } : shortcut" />
                  </slot>
                </span>
              </ULinkBase>
            </ULink>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow()" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style>
@keyframes dropdown-menu-open {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes dropdown-menu-closed {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
