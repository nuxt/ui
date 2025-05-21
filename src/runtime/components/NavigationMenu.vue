<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { NavigationMenuRootProps, NavigationMenuRootEmits, NavigationMenuContentProps, NavigationMenuContentEmits, AccordionRootProps } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/navigation-menu'
import type { AvatarProps, BadgeProps, LinkProps, PopoverProps, TooltipProps } from '../types'
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem, EmitsToProps, ComponentConfig } from '../types/utils'

type NavigationMenu = ComponentConfig<typeof theme, AppConfig, 'navigationMenu'>

export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'type' | 'ui'> {
  /** Description is only used when `orientation` is `horizontal`. */
  description?: string
  [key: string]: any
}

export interface NavigationMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: string
  avatar?: AvatarProps
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | BadgeProps
  /**
   * Display a tooltip on the item when the menu is collapsed with the label of the item.
   * This has priority over the global `tooltip` prop.
   */
  tooltip?: boolean | TooltipProps
  /**
   * Display a popover on the item when the menu is collapsed with the children list.
   * This has priority over the global `popover` prop.
   */
  popover?: boolean | PopoverProps
  /**
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The type of the item.
   * The `label` type only works on `vertical` orientation.
   * @defaultValue 'link'
   */
  type?: 'label' | 'link'
  slot?: string
  /**
   * The value of the item. Avoid using `index` as the value to prevent conflicts in horizontal orientation with Reka UI.
   * @defaultValue `item-${index}`
   */
  value?: string
  children?: NavigationMenuChildItem[]
  defaultOpen?: boolean
  open?: boolean
  onSelect?(e: Event): void
  class?: any
  ui?: Pick<NavigationMenu['slots'], 'item' | 'linkLeadingAvatarSize' | 'linkLeadingAvatar' | 'linkLeadingIcon' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkTrailing' | 'linkTrailingBadgeSize' | 'linkTrailingBadge' | 'linkTrailingIcon' | 'label' | 'link' | 'content' | 'childList' | 'childLabel' | 'childItem' | 'childLink' | 'childLinkIcon' | 'childLinkWrapper' | 'childLinkLabel' | 'childLinkLabelExternalIcon' | 'childLinkDescription'>
  [key: string]: any
}

export interface NavigationMenuProps<T extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>> extends Pick<NavigationMenuRootProps, 'modelValue' | 'defaultValue' | 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'>, Pick<AccordionRootProps, 'disabled' | 'type' | 'collapsible'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: string
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.ui.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | string
  items?: T
  /**
   * @defaultValue 'primary'
   */
  color?: NavigationMenu['variants']['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: NavigationMenu['variants']['variant']
  /**
   * The orientation of the menu.
   * @defaultValue 'horizontal'
   */
  orientation?: NavigationMenuRootProps['orientation']
  /**
   * Collapse the navigation menu to only show icons.
   * Only works when `orientation` is `vertical`.
   * @defaultValue false
   */
  collapsed?: boolean
  /**
   * Display a tooltip on the items when the menu is collapsed with the label of the item.
   * `{ delayDuration: 0, content: { side: 'right' } }`{lang="ts-type"}
   * @defaultValue false
   */
  tooltip?: boolean | TooltipProps
  /**
   * Display a popover on the items when the menu is collapsed with the children list.
   * `{ mode: 'hover', content: { side: 'right', align: 'start', alignOffset: 2 } }`{lang="ts-type"}
   * @defaultValue false
   */
  popover?: boolean | PopoverProps
  /** Display a line next to the active item. */
  highlight?: boolean
  /**
   * @defaultValue 'primary'
   */
  highlightColor?: NavigationMenu['variants']['highlightColor']
  /** The content of the menu. */
  content?: Omit<NavigationMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<NavigationMenuContentEmits>>
  /**
   * The orientation of the content.
   * Only works when `orientation` is `horizontal`.
   * @defaultValue 'horizontal'
   */
  contentOrientation?: NavigationMenu['variants']['contentOrientation']
  /**
   * Display an arrow alongside the menu.
   * @defaultValue false
   */
  arrow?: boolean
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: keyof NestedItem<T>
  class?: any
  ui?: NavigationMenu['slots']
}

export interface NavigationMenuEmits extends NavigationMenuRootEmits {}

type SlotProps<T extends NavigationMenuItem> = (props: { item: T, index: number, active?: boolean }) => any

export type NavigationMenuSlots<
  A extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'item-content': SlotProps<T>
  'list-leading': (props?: {}) => any
  'list-trailing': (props?: {}) => any
} & DynamicSlots<MergeTypes<T>, 'leading' | 'label' | 'trailing' | 'content', { index: number, active?: boolean }>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<NavigationMenuItem>">
import { computed, toRef } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { get, isArrayOfArray } from '../utils'
import { tv } from '../utils/tv'
import { pickLinkProps } from '../utils/link'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UBadge from './Badge.vue'
import UPopover from './Popover.vue'
import UTooltip from './Tooltip.vue'

const props = withDefaults(defineProps<NavigationMenuProps<T>>(), {
  orientation: 'horizontal',
  contentOrientation: 'horizontal',
  externalIcon: true,
  delayDuration: 0,
  type: 'multiple',
  collapsible: true,
  unmountOnHide: true,
  labelKey: 'label'
})
const emits = defineEmits<NavigationMenuEmits>()
const slots = defineSlots<NavigationMenuSlots<T>>()

const appConfig = useAppConfig() as NavigationMenu['AppConfig']

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
const accordionProps = useForwardPropsEmits(reactivePick(props, 'collapsible', 'disabled', 'type', 'unmountOnHide'), emits)
const contentProps = toRef(() => props.content)
const tooltipProps = toRef(() => defu(typeof props.tooltip === 'boolean' ? {} : props.tooltip, { delayDuration: 0, content: { side: 'right' } }) as TooltipProps)
const popoverProps = toRef(() => defu(typeof props.popover === 'boolean' ? {} : props.popover, { mode: 'hover', content: { side: 'right', align: 'start', alignOffset: 2 } }) as PopoverProps)

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ item: NavigationMenuItem, index: number, active?: boolean }>()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: NavigationMenuItem, index: number, level?: number }>({
  props: {
    item: Object,
    index: Number,
    level: Number
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.navigationMenu || {}) })({
  orientation: props.orientation,
  contentOrientation: props.orientation === 'vertical' ? undefined : props.contentOrientation,
  collapsed: props.collapsed,
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}))

const lists = computed<NavigationMenuItem[][]>(() =>
  props.items?.length
    ? isArrayOfArray(props.items)
      ? props.items
      : [props.items]
    : []
)

function getAccordionDefaultValue(list: NavigationMenuItem[]) {
  function findItemsWithDefaultOpen(items: NavigationMenuItem[], level = 0): string[] {
    return items.reduce((acc: string[], item, index) => {
      if (item.defaultOpen || item.open) {
        acc.push(item.value || (level > 0 ? `item-${level}-${index}` : `item-${index}`))
      }
      if (item.children?.length) {
        acc.push(...findItemsWithDefaultOpen(item.children, level + 1))
      }
      return acc
    }, [])
  }

  const indexes = findItemsWithDefaultOpen(list)

  return props.type === 'single' ? indexes[0] : indexes
}
</script>

<template>
  <DefineLinkTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof NavigationMenuSlots<T>)" :item="item" :index="index">
      <slot :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
        <UAvatar v-if="item.avatar" :size="((item.ui?.linkLeadingAvatarSize || props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ class: [props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })" />
        <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
      </slot>

      <span
        v-if="(!collapsed || orientation !== 'vertical') && (get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>])"
        :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })"
      >
        <slot :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" :class="ui.linkLabelExternalIcon({ class: [props.ui?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })" />
      </span>

      <component :is="orientation === 'vertical' && item.children?.length && !collapsed ? AccordionTrigger : 'span'" v-if="(!collapsed || orientation !== 'vertical') && (item.badge || (orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (orientation === 'vertical' && item.children?.length) || item.trailingIcon || !!slots[(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>])" as="span" :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })" @click.stop.prevent>
        <slot :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
          <UBadge
            v-if="item.badge"
            color="neutral"
            variant="outline"
            :size="((item.ui?.linkTrailingBadgeSize || props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
            :class="ui.linkTrailingBadge({ class: [props.ui?.linkTrailingBadge, item.ui?.linkTrailingBadge] })"
          />

          <UIcon v-if="(orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (orientation === 'vertical' && item.children?.length)" :name="item.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
          <UIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
        </slot>
      </component>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index, level = 0 }">
    <component
      :is="(orientation === 'vertical' && !collapsed) ? AccordionItem : NavigationMenuItem"
      as="li"
      :value="item.value || (level > 0 ? `item-${level}-${index}` : `item-${index}`)"
    >
      <div v-if="orientation === 'vertical' && item.type === 'label' && !collapsed" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
        <ReuseLinkTemplate :item="item" :index="index" />
      </div>
      <ULink v-else-if="item.type !== 'label'" v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item as Omit<NavigationMenuItem, 'type'>)" custom>
        <component
          :is="(orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) ? NavigationMenuTrigger : ((orientation === 'vertical' && item.children?.length && !collapsed && !(slotProps as any).href) ? AccordionTrigger : NavigationMenuLink)"
          as-child
          :active="active"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <UPopover v-if="orientation === 'vertical' && collapsed && item.children?.length && (!!props.popover || !!item.popover)" v-bind="{ ...popoverProps, ...(typeof item.popover === 'boolean' ? {} : item.popover || {}) }" :ui="{ content: ui.content({ class: [props.ui?.content, item.ui?.content] }) }">
            <ULinkBase v-bind="slotProps" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active" :index="index" />
            </ULinkBase>

            <template #content>
              <slot :name="((item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
                <ul :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
                  <li :class="ui.childLabel({ class: [props.ui?.childLabel, item.ui?.childLabel] })">
                    {{ get(item, props.labelKey as string) }}
                  </li>
                  <li v-for="(childItem, childIndex) in item.children" :key="childIndex" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                    <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                      <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                        <ULinkBase v-bind="childSlotProps" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                          <UIcon v-if="childItem.icon" :name="childItem.icon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                          <span :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                            {{ get(childItem, props.labelKey as string) }}

                            <UIcon v-if="childItem.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                          </span>
                        </ULinkBase>
                      </NavigationMenuLink>
                    </ULink>
                  </li>
                </ul>
              </slot>
            </template>
          </UPopover>
          <UTooltip v-else-if="orientation === 'vertical' && collapsed && (!!props.tooltip || !!item.tooltip)" :text="get(item, props.labelKey as string)" v-bind="{ ...tooltipProps, ...(typeof item.tooltip === 'boolean' ? {} : item.tooltip || {}) }">
            <ULinkBase v-bind="slotProps" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active" :index="index" />
            </ULinkBase>
          </UTooltip>
          <ULinkBase v-else v-bind="slotProps" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active, disabled: !!item.disabled, level: orientation === 'horizontal' || level > 0 })">
            <ReuseLinkTemplate :item="item" :active="active" :index="index" />
          </ULinkBase>
        </component>

        <NavigationMenuContent v-if="orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])" v-bind="contentProps" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
          <slot :name="((item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
            <ul :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
              <li v-for="(childItem, childIndex) in item.children" :key="childIndex" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                  <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                    <ULinkBase v-bind="childSlotProps" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                      <UIcon v-if="childItem.icon" :name="childItem.icon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                      <div :class="ui.childLinkWrapper({ class: [props.ui?.childLinkWrapper, item.ui?.childLinkWrapper] })">
                        <p :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                          {{ get(childItem, props.labelKey as string) }}

                          <UIcon v-if="childItem.target === '_blank' && externalIcon !== false" :name="typeof externalIcon === 'string' ? externalIcon : appConfig.ui.icons.external" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                        </p>
                        <p v-if="childItem.description" :class="ui.childLinkDescription({ class: [props.ui?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })">
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

      <AccordionContent v-if="orientation === 'vertical' && item.children?.length && !collapsed" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
        <ul :class="ui.childList({ class: props.ui?.childList })">
          <ReuseItemTemplate
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            :item="childItem"
            :index="childIndex"
            :level="level + 1"
            :class="ui.childItem({ class: [props.ui?.childItem, childItem.ui?.childItem] })"
          />
        </ul>
      </AccordionContent>
    </component>
  </DefineItemTemplate>

  <NavigationMenuRoot v-bind="rootProps" :data-collapsed="collapsed" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        v-bind="orientation === 'vertical' && !collapsed ? {
          ...accordionProps,
          defaultValue: getAccordionDefaultValue(list)
        } : {}"
        :is="orientation === 'vertical' && !collapsed ? AccordionRoot : NavigationMenuList"
        as="ul"
        :class="ui.list({ class: props.ui?.list })"
      >
        <ReuseItemTemplate v-for="(item, index) in list" :key="`list-${listIndex}-${index}`" :item="item" :index="index" :class="ui.item({ class: [props.ui?.item, item.ui?.item] })" />
      </component>

      <div v-if="orientation === 'vertical' && listIndex < lists.length - 1" :class="ui.separator({ class: props.ui?.separator })" />
    </template>

    <slot name="list-trailing" />

    <div v-if="orientation === 'horizontal'" :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })">
      <NavigationMenuIndicator v-if="arrow" :class="ui.indicator({ class: props.ui?.indicator })">
        <div :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport :class="ui.viewport({ class: props.ui?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
