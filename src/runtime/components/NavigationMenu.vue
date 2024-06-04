<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuItemProps, NavigationMenuContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigation-menu'
import type { AvatarProps, BadgeProps, LinkProps } from '#ui/types'
import type { DynamicSlots } from '#ui/types/utils'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuchildItem extends Omit<LinkProps, 'custom'> {
  label: string
  description?: string
  icon?: string
  select? (e: MouseEvent): void
}

export interface NavigationMenuItem extends Omit<LinkProps, 'custom'>, Pick<NavigationMenuItemProps, 'value'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
  trailingIcon?: string
  slot?: string
  children?: NavigationMenuchildItem[]
  select? (e: MouseEvent): void
}

type NavigationMenuVariants = VariantProps<typeof navigationMenu>

export interface NavigationMenuProps<T> extends Omit<NavigationMenuRootProps, 'asChild' | 'dir'> {
  /**
   * The icon displayed to open the menu.
   * @defaultValue `appConfig.ui.icons.chevronDown`
   */
  trailingIcon?: string
  items?: T[] | T[][]
  color?: NavigationMenuVariants['color']
  variant?: NavigationMenuVariants['variant']
  /**
   * Display a line next to the active item.
   */
  highlight?: boolean
  highlightColor?: NavigationMenuVariants['highlightColor']
  content?: Omit<NavigationMenuContentProps, 'asChild' | 'forceMount'>
  arrow?: boolean
  class?: any
  ui?: Partial<typeof navigationMenu.slots>
}

export interface NavigationMenuEmits extends NavigationMenuRootEmits {}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export type NavigationMenuSlots<T extends { slot?: string }> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends NavigationMenuItem">
import { computed, toRef } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, useForwardPropsEmits } from 'radix-vue'
import { reactivePick } from '@vueuse/core'
import { UIcon, UAvatar, UBadge, ULink, ULinkBase } from '#components'
import { pickLinkProps } from '#ui/utils/link'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), {
  orientation: 'horizontal',
  delayDuration: 0
})
const emits = defineEmits<NavigationMenuEmits>()
const slots = defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'delayDuration', 'skipDelayDuration', 'orientation'), emits)
const contentProps = toRef(() => props.content)

const ui = computed(() => tv({ extend: navigationMenu, slots: props.ui })({
  orientation: props.orientation,
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}))

const lists = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <NavigationMenuRoot v-bind="rootProps" :class="ui.root({ class: props.class })">
    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <NavigationMenuList :class="ui.list()">
        <NavigationMenuItem v-for="(item, index) in list" :key="`list-${listIndex}-${index}`" :value="item.value || String(index)" :class="ui.item()">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <component
              :is="item.children?.length ? NavigationMenuTrigger : NavigationMenuLink"
              v-bind="item.children?.length ? { disabled: item.disabled } : { active }"
              as-child
              :active="active"
              @select="item.select"
            >
              <ULinkBase v-bind="slotProps" :class="ui.link({ active, disabled: !!item.disabled })">
                <slot :name="item.slot || 'item'" :item="item" :index="index">
                  <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="item" :active="active" :index="index">
                    <UAvatar v-if="item.avatar" size="2xs" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ active, disabled: !!item.disabled })" />
                    <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ active, disabled: !!item.disabled })" />
                  </slot>

                  <span v-if="item.label || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.linkLabel()">
                    <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="item" :active="active" :index="index">
                      {{ item.label }}
                    </slot>

                    <UIcon v-if="item.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.linkLabelExternalIcon({ active })" />
                  </span>

                  <span v-if="item.badge || (item.children?.length && orientation === 'horizontal') || !!slots[item.slot ? `${item.slot}-trailing`: 'item-trailing']" :class="ui.linkTrailing()">
                    <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="item" :active="active" :index="index">
                      <UBadge
                        v-if="item.badge"
                        color="white"
                        size="sm"
                        v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
                        :class="ui.linkTrailingBadge()"
                      />
                      <UIcon v-if="item.children?.length && orientation === 'horizontal'" :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ active })" />
                    </slot>
                  </span>
                </slot>
              </ULinkBase>
            </component>

            <NavigationMenuContent v-if="item.children?.length && orientation === 'horizontal'" v-bind="contentProps" :class="ui.content()">
              <ul :class="ui.childList()">
                <li v-for="(childItem, childIndex) in item.children" :key="childIndex" :class="ui.childItem()">
                  <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                    <NavigationMenuLink as-child :active="childActive" @select="childItem.select">
                      <ULinkBase v-bind="childSlotProps" :class="ui.childLink({ active: childActive })">
                        <UIcon v-if="childItem.icon" :name="childItem.icon" :class="ui.childLinkIcon({ active: childActive })" />

                        <div :class="ui.childLinkWrapper()">
                          <p :class="ui.childLinkLabel({ active: childActive })">
                            {{ childItem.label }}

                            <UIcon v-if="childItem.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.childLinkLabelExternalIcon({ active: childActive })" />
                          </p>
                          <p v-if="childItem.description" :class="ui.childLinkDescription({ active: childActive })">
                            {{ childItem.description }}
                          </p>
                        </div>
                      </ULinkBase>
                    </NavigationMenuLink>
                  </ULink>
                </li>
              </ul>
            </NavigationMenuContent>
          </ULink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <div v-if="orientation === 'vertical' && listIndex < lists.length - 1" :class="ui.separator()" />
    </template>

    <div v-if="orientation === 'horizontal'" :class="ui.viewportWrapper()">
      <NavigationMenuIndicator v-if="arrow" :class="ui.indicator()">
        <div :class="ui.arrow()" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport :class="ui.viewport()" />
    </div>
  </NavigationMenuRoot>
</template>
