<script lang="ts">
import { tv, type VariantProps } from 'tailwind-variants'
import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuContentProps, CollapsibleRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/navigation-menu'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, BadgeProps, LinkProps } from '../types'
import type { DynamicSlots, MaybeArrayOfArray, MaybeArrayOfArrayItem, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { navigationMenu: Partial<typeof theme> } }

const navigationMenu = tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })

export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'children'> {
  /** Description is only used when `orientation` is `horizontal`. */
  description?: string
}

export interface NavigationMenuItem extends Omit<LinkProps, 'raw' | 'custom'>, Pick<CollapsibleRootProps, 'defaultOpen' | 'open'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  badge?: string | number | BadgeProps
  trailingIcon?: string
  slot?: string
  value?: string
  children?: NavigationMenuChildItem[]
  onSelect?(e: Event): void
}

type NavigationMenuVariants = VariantProps<typeof navigationMenu>

export interface NavigationMenuProps<T> extends Pick<NavigationMenuRootProps, 'modelValue' | 'defaultValue' | 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   */
  trailingIcon?: string
  items?: T
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
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: PartialString<typeof navigationMenu.slots>
}

export interface NavigationMenuEmits extends NavigationMenuRootEmits {}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export type NavigationMenuSlots<T extends { slot?: string }> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'item-content': SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>

extendDevtoolsMeta({
  ignoreProps: ['items'],
  defaultProps: {
    items: [
      [{
        label: 'Documentation',
        icon: 'i-lucide-book-open',
        badge: 10,
        children: [{
          label: 'Introduction',
          description: 'Fully styled and customizable components for Nuxt.',
          icon: 'i-lucide-house'
        }, {
          label: 'Installation',
          description: 'Learn how to install and configure Nuxt UI in your application.',
          icon: 'i-lucide-cloud-download'
        }, {
          label: 'Theming',
          description: 'Learn how to customize the look and feel of the components.',
          icon: 'i-lucide-swatch-book'
        }, {
          label: 'Shortcuts',
          description: 'Learn how to display and define keyboard shortcuts in your app.',
          icon: 'i-lucide-monitor'
        }]
      }, {
        label: 'GitHub',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      }, {
        label: 'Help',
        icon: 'i-lucide-circle-help',
        disabled: true
      }]
    ]
  }
})
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<NavigationMenuItem>">
import { computed, toRef } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, useForwardPropsEmits } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { get } from '../utils'
import { pickLinkProps } from '../utils/link'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UBadge from './Badge.vue'
import UCollapsible from './Collapsible.vue'

const props = withDefaults(defineProps<NavigationMenuProps<I>>(), {
  orientation: 'horizontal',
  delayDuration: 0,
  labelKey: 'label',
  unmountOnHide: true
})
const emits = defineEmits<NavigationMenuEmits>()
const slots = defineSlots<NavigationMenuSlots<T>>()

const rootProps = useForwardPropsEmits(computed(() => ({
  as: props.as,
  modelValue: props.modelValue,
  defaultValue: props.defaultValue,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide
})), emits)

const contentProps = toRef(() => props.content)

const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: NavigationMenuItem, active?: boolean, index: number }>()

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
  <DefineItemTemplate v-slot="{ item, active, index }">
    <slot :name="item.slot || 'item'" :item="(item as T)" :index="index">
      <slot :name="item.slot ? `${item.slot}-leading` : 'item-leading'" :item="(item as T)" :active="active" :index="index">
        <UAvatar v-if="item.avatar" :size="((props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ class: props.ui?.linkLeadingAvatar, active, disabled: !!item.disabled })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon, active, disabled: !!item.disabled })" />
      </slot>

      <span v-if="get(item, props.labelKey as string) || !!slots[item.slot ? `${item.slot}-label` : 'item-label']" :class="ui.linkLabel({ class: props.ui?.linkLabel })">
        <slot :name="item.slot ? `${item.slot}-label` : 'item-label'" :item="(item as T)" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.linkLabelExternalIcon({ class: props.ui?.linkLabelExternalIcon, active })" />
      </span>

      <span v-if="item.badge || (orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])) || (orientation === 'vertical' && item.children?.length) || item.trailingIcon || !!slots[item.slot ? `${item.slot}-trailing` : 'item-trailing']" :class="ui.linkTrailing({ class: props.ui?.linkTrailing })">
        <slot :name="item.slot ? `${item.slot}-trailing` : 'item-trailing'" :item="(item as T)" :active="active" :index="index">
          <UBadge
            v-if="item.badge"
            color="neutral"
            variant="outline"
            :size="((props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
            :class="ui.linkTrailingBadge({ class: props.ui?.linkTrailingBadge })"
          />

          <UIcon v-if="(orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])) || (orientation === 'vertical' && item.children?.length)" :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: props.ui?.linkTrailingIcon, active })" />
          <UIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" :class="ui.linkTrailingIcon({ class: props.ui?.linkTrailingIcon, active })" />
        </slot>
      </span>
    </slot>
  </DefineItemTemplate>

  <NavigationMenuRoot v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <NavigationMenuList :class="ui.list({ class: props.ui?.list })">
        <component
          :is="(item.children?.length && orientation === 'vertical') ? UCollapsible : NavigationMenuItem"
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          as="li"
          :value="item.value || String(index)"
          :default-open="item.defaultOpen"
          :unmount-on-hide="(item.children?.length && orientation === 'vertical') ? unmountOnHide : undefined"
          :open="item.open"
          :class="ui.item({ class: props.ui?.item })"
        >
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <component
              :is="(orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])) ? NavigationMenuTrigger : NavigationMenuLink"
              as-child
              :active="active"
              :disabled="item.disabled"
              @select="item.onSelect"
            >
              <ULinkBase v-bind="slotProps" :class="ui.link({ class: [props.ui?.link, item.class], active, disabled: !!item.disabled })">
                <ReuseItemTemplate :item="(item as T)" :active="active" :index="index" />
              </ULinkBase>
            </component>

            <NavigationMenuContent v-if="orientation === 'horizontal' && (item.children?.length || !!slots[item.slot ? `${item.slot}-content` : 'item-content'])" v-bind="contentProps" :class="ui.content({ class: props.ui?.content })">
              <slot :name="item.slot ? `${item.slot}-content` : 'item-content'" :item="(item as T)" :active="active" :index="index">
                <ul :class="ui.childList({ class: props.ui?.childList })">
                  <li v-for="(childItem, childIndex) in item.children" :key="childIndex" :class="ui.childItem({ class: props.ui?.childItem })">
                    <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                      <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                        <ULinkBase v-bind="childSlotProps" :class="ui.childLink({ class: [props.ui?.childLink, childItem.class], active: childActive })">
                          <UIcon v-if="childItem.icon" :name="childItem.icon" :class="ui.childLinkIcon({ class: props.ui?.childLinkIcon, active: childActive })" />

                          <div :class="ui.childLinkWrapper({ class: props.ui?.childLinkWrapper })">
                            <p :class="ui.childLinkLabel({ class: props.ui?.childLinkLabel, active: childActive })">
                              {{ get(childItem, props.labelKey as string) }}

                              <UIcon v-if="childItem.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.childLinkLabelExternalIcon({ class: props.ui?.childLinkLabelExternalIcon, active: childActive })" />
                            </p>
                            <p v-if="childItem.description" :class="ui.childLinkDescription({ class: props.ui?.childLinkDescription, active: childActive })">
                              {{ childItem.description }}
                            </p>
                          </div>
                        </ULinkBase>
                      </NavigationMenuLink>
                    </ULink>
                  </li>
                </ul>
              </slot>
            </NavigationMenuContent>
          </ULink>

          <template v-if="orientation === 'vertical' && item.children?.length" #content>
            <ul :class="ui.childList({ class: props.ui?.childList })">
              <li v-for="(childItem, childIndex) in item.children" :key="childIndex" :class="ui.childItem({ class: props.ui?.childItem })">
                <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                  <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                    <ULinkBase v-bind="childSlotProps" :class="ui.link({ class: [props.ui?.link, childItem.class], active: childActive, disabled: !!childItem.disabled })">
                      <ReuseItemTemplate :item="(childItem as T)" :active="childActive" :index="childIndex" />
                    </ULinkBase>
                  </NavigationMenuLink>
                </ULink>
              </li>
            </ul>
          </template>
        </component>
      </NavigationMenuList>

      <div v-if="orientation === 'vertical' && listIndex < lists.length - 1" :class="ui.separator({ class: props.ui?.separator })" />
    </template>

    <div v-if="orientation === 'horizontal'" :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })">
      <NavigationMenuIndicator v-if="arrow" :class="ui.indicator({ class: props.ui?.indicator })">
        <div :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport :class="ui.viewport({ class: props.ui?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
