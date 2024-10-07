<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuItemProps, NavigationMenuContentProps } from 'radix-vue'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigation-menu'
import type { AvatarProps, BadgeProps, LinkProps } from '../types'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuChildItem extends Omit<LinkProps, 'raw' | 'custom'> {
  label: string
  description?: string
  icon?: string
  select?(e: Event): void
}

export interface NavigationMenuItem extends Omit<LinkProps, 'raw' | 'custom'>, Pick<NavigationMenuItemProps, 'value'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
  trailingIcon?: string
  slot?: string
  children?: NavigationMenuChildItem[]
  select?(e: Event): void
}

type NavigationMenuVariants = VariantProps<typeof navigationMenu>

export interface NavigationMenuProps<T> extends Pick<NavigationMenuRootProps, 'defaultValue' | 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'modelValue' | 'skipDelayDuration'> {
  /**
   * The element or component this component should render as.
   * @defaultValue `div`
   */
  as?: any
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  trailingIcon?: string
  items?: T[] | T[][]
  color?: NavigationMenuVariants['color']
  variant?: NavigationMenuVariants['variant']
  /**
   * The orientation of the menu.
   * @defaultValue 'horizontal'
   */
  orientation?: NavigationMenuRootProps['orientation']
  /** Display a line next to the active item. */
  highlight?: boolean
  highlightColor?: NavigationMenuVariants['highlightColor']
  /** The content of the menu. */
  content?: Omit<NavigationMenuContentProps, 'as' | 'asChild' | 'forceMount'>
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
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
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UBadge from './Badge.vue'
import { pickLinkProps } from '../utils/link'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), {
  orientation: 'horizontal',
  delayDuration: 0
})
const emits = defineEmits<NavigationMenuEmits>()
const slots = defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'modelValue', 'defaultValue', 'delayDuration', 'skipDelayDuration', 'orientation'), emits)
const contentProps = toRef(() => props.content)

const ui = computed(() => navigationMenu({
  orientation: props.orientation,
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}))

const lists = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as T[][] : [])
</script>

<template>
  <NavigationMenuRoot v-bind="rootProps" data-slot="root" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <NavigationMenuList data-slot="list" :class="ui.list({ class: props.ui?.list })">
        <NavigationMenuItem v-for="(item, index) in list" :key="`list-${listIndex}-${index}`" :value="item.value || String(index)" data-slot="item" :class="ui.item({ class: props.ui?.item })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <component
              :is="item.children?.length ? NavigationMenuTrigger : NavigationMenuLink"
              v-bind="item.children?.length ? { disabled: item.disabled } : { active }"
              as-child
              :active="active"
              @select="item.select"
            >
              <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.class], active, disabled: !!item.disabled })">
                <slot :name="item.slot || 'item'" :item="item" :index="index">
                  <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="item" :active="active" :index="index">
                    <UAvatar v-if="item.avatar" :size="((props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: props.ui?.linkLeadingAvatar, active, disabled: !!item.disabled })" />
                    <UIcon v-else-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon, active, disabled: !!item.disabled })" />
                  </slot>

                  <span v-if="item.label || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" data-slot="linkLabel" :class="ui.linkLabel({ class: props.ui?.linkLabel })">
                    <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="item" :active="active" :index="index">
                      {{ item.label }}
                    </slot>

                    <UIcon v-if="item.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: props.ui?.linkLabelExternalIcon, active })" />
                  </span>

                  <span v-if="item.badge || (item.children?.length && orientation === 'horizontal') || !!slots[item.slot ? `${item.slot}-trailing`: 'item-trailing']" data-slot="linkTrailing" :class="ui.linkTrailing({ class: props.ui?.linkTrailing })">
                    <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="item" :active="active" :index="index">
                      <UBadge
                        v-if="item.badge"
                        color="neutral"
                        variant="outline"
                        :size="((props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()) as BadgeProps['size'])"
                        v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
                        data-slot="linkTrailingBadge"
                        :class="ui.linkTrailingBadge({ class: props.ui?.linkTrailingBadge })"
                      />
                      <UIcon v-if="item.children?.length && orientation === 'horizontal'" :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: props.ui?.linkTrailingIcon, active })" />
                    </slot>
                  </span>
                </slot>
              </ULinkBase>
            </component>

            <NavigationMenuContent v-if="item.children?.length && orientation === 'horizontal'" v-bind="contentProps" data-slot="content" :class="ui.content({ class: props.ui?.content })">
              <ul data-slot="childList" :class="ui.childList({ class: props.ui?.childList })">
                <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: props.ui?.childItem })">
                  <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                    <NavigationMenuLink as-child :active="childActive" @select="childItem.select">
                      <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [props.ui?.childLink, childItem.class], active: childActive })">
                        <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: props.ui?.childLinkIcon, active: childActive })" />

                        <div data-slot="childLinkWrapper" :class="ui.childLinkWrapper({ class: props.ui?.childLinkWrapper })">
                          <p data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: props.ui?.childLinkLabel, active: childActive })">
                            {{ childItem.label }}

                            <UIcon v-if="childItem.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: props.ui?.childLinkLabelExternalIcon, active: childActive })" />
                          </p>
                          <p v-if="childItem.description" data-slot="childLinkDescription" :class="ui.childLinkDescription({ class: props.ui?.childLinkDescription, active: childActive })">
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

      <div v-if="orientation === 'vertical' && listIndex < lists.length - 1" data-slot="separator" :class="ui.separator({ class: props.ui?.separator })" />
    </template>

    <div v-if="orientation === 'horizontal'" data-slot="viewportWrapper" :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })">
      <NavigationMenuIndicator v-if="arrow" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
        <div data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
