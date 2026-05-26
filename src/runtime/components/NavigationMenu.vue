<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { NavigationMenuRootProps, NavigationMenuContentProps, NavigationMenuContentEmits, AccordionRootProps } from 'reka-ui'
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/navigation-menu'
import type { AvatarProps, BadgeProps, ChipProps, IconProps, LinkProps, PopoverProps, TooltipProps } from '../types'
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

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
  icon?: IconProps['name']
  avatar?: AvatarProps
  /**
   * Display a badge on the item.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   */
  badge?: string | number | BadgeProps
  /**
   * Display a chip around the icon of the item.
   * `{ inset: true }`{lang="ts-type"}
   */
  chip?: boolean | ChipProps
  /**
   * Display a tooltip on the item with the label of the item.
   * In `vertical` orientation, only works when the menu is `collapsed`.
   * In `horizontal` orientation, works on any item.
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
  trailingIcon?: IconProps['name']
  /**
   * The type of the item.
   * The `label` type is only displayed in `vertical` orientation.
   * The `trigger` type is used to force the item to be collapsible when its a link in `vertical` orientation.
   * @defaultValue 'link'
   */
  type?: 'label' | 'trigger' | 'link'
  slot?: string
  /**
   * The value of the item. Avoid using `index` as the value to prevent conflicts in horizontal orientation with Reka UI.
   * @defaultValue `item-${index}`, `item-${level}-${index}` for nested children, or `group-${listIndex}-item-${index}` when using grouped items
   */
  value?: string
  children?: NavigationMenuChildItem[]
  defaultOpen?: boolean
  open?: boolean
  onSelect?: (e: Event) => void
  class?: any
  ui?: Pick<NavigationMenu['slots'], 'item' | 'linkLeadingAvatarSize' | 'linkLeadingAvatar' | 'linkLeadingIcon' | 'linkLeadingChipSize' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkTrailing' | 'linkTrailingBadgeSize' | 'linkTrailingBadge' | 'linkTrailingIcon' | 'label' | 'link' | 'content' | 'childList' | 'childLabel' | 'childItem' | 'childLink' | 'childLinkIcon' | 'childLinkWrapper' | 'childLinkLabel' | 'childLinkLabelExternalIcon' | 'childLinkDescription'>
  [key: string]: any
}

type SingleOrMultipleType = 'single' | 'multiple'
type Orientation = NavigationMenu['variants']['orientation']

type NavigationMenuModelValue<
  K extends SingleOrMultipleType = SingleOrMultipleType,
  O extends Orientation = Orientation
> = O extends 'horizontal' ? string : K extends 'single' ? string : K extends 'multiple' ? string[] : string | string[]

export interface NavigationMenuProps<
  T extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>,
  K extends SingleOrMultipleType = SingleOrMultipleType,
  O extends Orientation = Orientation
> extends Pick<NavigationMenuRootProps, 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'>, Pick<AccordionRootProps, 'disabled' | 'collapsible'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * Determines whether a "single" or "multiple" items can be selected at a time.
   *
   * Only works when `orientation` is `vertical`.
   * @defaultValue 'multiple'
   */
  type?: K
  /**
   * The controlled value of the active item(s).
   * - In horizontal orientation: always `string`
   * - In vertical orientation with `type="single"`: `string`
   * - In vertical orientation with `type="multiple"`: `string[]`
   *
   * Use this when you need to control the state of the items. Can be binded with `v-model`
   */
  modelValue?: NavigationMenuModelValue<K, O>
  /**
   * The default active value of the item(s).
   * - In horizontal orientation: always `string`
   * - In vertical orientation with `type="single"`: `string`
   * - In vertical orientation with `type="multiple"`: `string[]`
   *
   * Use when you do not need to control the state of the item(s).
   */
  defaultValue?: NavigationMenuModelValue<K, O>
  /**
   * The icon displayed to open the menu.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The icon displayed when the item is an external link.
   * Set to `false` to hide the external icon.
   * @defaultValue appConfig.ui.icons.external
   * @IconifyIcon
   */
  externalIcon?: boolean | IconProps['name']
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
  orientation?: O
  /**
   * Collapse the navigation menu to only show icons.
   * Only works when `orientation` is `vertical`.
   * @defaultValue false
   */
  collapsed?: boolean
  /**
   * Display a tooltip on the items with the label of the item.
   * Only works when `orientation` is `vertical` and `collapsed` is `true`.
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
   * The key used to get the value from the item.
   * @defaultValue 'value'
   */
  valueKey?: GetItemKeys<T>
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  class?: any
  ui?: NavigationMenu['slots']
}

export type NavigationMenuEmits<
  K extends SingleOrMultipleType = SingleOrMultipleType,
  O extends Orientation = Orientation
> = {
  /**
   * Event handler called when the value changes.
   * - In horizontal orientation: emits `string`
   * - In vertical orientation with `type="single"`: emits `string | undefined`
   * - In vertical orientation with `type="multiple"`: emits `string[] | undefined`
   */
  'update:modelValue': [value: NavigationMenuModelValue<K, O> | undefined]
}

type SlotProps<T extends NavigationMenuItem> = (props: { item: T, index: number, active: boolean, ui: NavigationMenu['ui'] }) => VNode[]

export type NavigationMenuSlots<
  A extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>,
  T extends NestedItem<A> = NestedItem<A>
> = {
  'item'?: SlotProps<T>
  'item-leading'?: SlotProps<T>
  'item-label'?: (props: { item: T, index: number, active: boolean }) => VNode[]
  'item-trailing'?: SlotProps<T>
  'item-content'?: (props: { item: T, index: number, active: boolean, ui: NavigationMenu['ui'], close: (() => void) | undefined }) => VNode[]
  'list-leading'?: (props?: {}) => VNode[]
  'list-trailing'?: (props?: {}) => VNode[]
}
& DynamicSlots<MergeTypes<T>, 'label', { index: number, active: boolean, ui: NavigationMenu['ui'] }>
& DynamicSlots<MergeTypes<T>, 'leading' | 'trailing' | 'content', { index: number, active: boolean, ui: NavigationMenu['ui'] }>

</script>

<script setup lang="ts" generic="T extends ArrayOrNested<NavigationMenuItem>, K extends SingleOrMultipleType = SingleOrMultipleType, O extends Orientation = Orientation">
import { computed, toRef } from 'vue'
import { NavigationMenuRoot, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent } from 'reka-ui'
import { useForwardProps } from '../composables/useForwardProps'
import { defu } from 'defu'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../composables/useComponentProps'
import { get, isArrayOfArray } from '../utils'
import { tv } from '../utils/tv'
import { pickLinkProps } from '../utils/link'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'
import UAvatar from './Avatar.vue'
import UIcon from './Icon.vue'
import UBadge from './Badge.vue'
import UChip from './Chip.vue'
import UPopover from './Popover.vue'
import UTooltip from './Tooltip.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<NavigationMenuProps<T, K, O>>(), {
  orientation: 'horizontal' as never,
  contentOrientation: 'horizontal',
  externalIcon: true,
  delayDuration: 0,
  type: 'multiple' as never,
  collapsible: true,
  unmountOnHide: true,
  valueKey: 'value',
  labelKey: 'label'
})
const emits = defineEmits<NavigationMenuEmits<K, O>>()
const slots = defineSlots<NavigationMenuSlots<T>>()

const props = useComponentProps<NavigationMenuProps<T, K, O>>('navigationMenu', _props)

const appConfig = useAppConfig() as NavigationMenu['AppConfig']

const rootProps = useForwardProps(computed(() => ({
  as: props.as,
  delayDuration: props.delayDuration,
  skipDelayDuration: props.skipDelayDuration,
  orientation: props.orientation,
  disableClickTrigger: props.disableClickTrigger,
  disableHoverTrigger: props.disableHoverTrigger,
  disablePointerLeaveClose: props.disablePointerLeaveClose,
  unmountOnHide: props.unmountOnHide
})), emits)
const accordionProps = useForwardProps(reactivePick(props, 'collapsible', 'disabled', 'type', 'unmountOnHide'), emits)
const contentProps = toRef(() => props.content)
const tooltipProps = toRef(() => defu(typeof props.tooltip === 'boolean' ? {} : props.tooltip, { ...(props.orientation === 'vertical' && { delayDuration: 0, content: { side: 'right' } }) }) as TooltipProps)
const popoverProps = toRef(() => defu(typeof props.popover === 'boolean' ? {} : props.popover, { mode: 'hover', content: { side: 'right', align: 'start', alignOffset: 2 } }) as PopoverProps)

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ item: NavigationMenuItem, index: number, active?: boolean }>()
const [DefineItemTemplate, ReuseItemTemplate] = createReusableTemplate<{ item: NavigationMenuItem, index: number, level?: number, listIndex?: number }>({
  props: {
    item: Object,
    index: Number,
    level: Number,
    listIndex: Number
  }
})

// eslint-disable-next-line vue/no-dupe-keys
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

function getItemValue(item: NavigationMenuItem, index: number, level: number, listIndex: number) {
  const prefix = lists.value.length > 1 ? `group-${listIndex}-` : ''
  return get(item, props.valueKey as string) ?? (level > 0 ? `${prefix}item-${level}-${index}` : `${prefix}item-${index}`)
}

function getAccordionDefaultValue(list: NavigationMenuItem[], level = 0, listIndex = 0) {
  const indexes = list.reduce((acc: string[], item, index) => {
    if (item.defaultOpen || item.open) {
      acc.push(getItemValue(item, index, level, listIndex))
    }
    return acc
  }, [])

  return props.type === 'single' ? indexes[0] : indexes
}

function onLinkTrailingClick(e: Event, item: NavigationMenuItem) {
  if (!item.children?.length) {
    return
  }

  if (props.orientation === 'horizontal') {
    e.preventDefault()
  } else if (props.orientation === 'vertical' && !props.collapsed) {
    e.preventDefault()
    e.stopPropagation()
  }
}
</script>

<template>
  <DefineLinkTemplate v-slot="{ item, active, index }">
    <slot :name="((item.slot || 'item') as keyof NavigationMenuSlots<T>)" :item="item" :index="index" :active="active" :ui="ui">
      <slot :name="((item.slot ? `${item.slot}-leading` : 'item-leading') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index" :ui="ui">
        <UAvatar v-if="item.avatar" :size="((item.ui?.linkLeadingAvatarSize || props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: [props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active, disabled: !!item.disabled })" />
        <UChip
          v-else-if="item.icon && item.chip"
          :size="((item.ui?.linkLeadingChipSize || props.ui?.linkLeadingChipSize || ui.linkLeadingChipSize()) as ChipProps['size'])"
          inset
          v-bind="typeof item.chip === 'object' ? item.chip : {}"
          data-slot="linkLeadingChip"
        >
          <UIcon :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
        </UChip>
        <UIcon v-else-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active, disabled: !!item.disabled })" />
      </slot>

      <span
        v-if="get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>]"
        data-slot="linkLabel"
        :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })"
      >
        <slot :name="((item.slot ? `${item.slot}-label` : 'item-label') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index">
          {{ get(item, props.labelKey as string) }}
        </slot>

        <UIcon v-if="item.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [props.ui?.linkLabelExternalIcon, item.ui?.linkLabelExternalIcon], active })" />
      </span>

      <component
        :is="props.orientation === 'vertical' && item.children?.length && !props.collapsed ? AccordionTrigger : 'span'"
        v-if="(item.badge || item.badge === 0) || (props.orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (props.orientation === 'vertical' && item.children?.length) || item.trailingIcon || !!slots[(item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>]"
        :as="props.orientation === 'vertical' && item.children?.length && !props.collapsed ? 'span' : undefined"
        data-slot="linkTrailing"
        :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, item.ui?.linkTrailing] })"
        @click="(e: Event) => onLinkTrailingClick(e, item)"
      >
        <slot :name="((item.slot ? `${item.slot}-trailing` : 'item-trailing') as keyof NavigationMenuSlots<T>)" :item="item" :active="active" :index="index" :ui="ui">
          <UBadge
            v-if="item.badge || item.badge === 0"
            color="neutral"
            variant="outline"
            :size="((item.ui?.linkTrailingBadgeSize || props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof item.badge === 'string' || typeof item.badge === 'number') ? { label: item.badge } : item.badge"
            data-slot="linkTrailingBadge"
            :class="ui.linkTrailingBadge({ class: [props.ui?.linkTrailingBadge, item.ui?.linkTrailingBadge] })"
          />

          <UIcon v-if="(props.orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) || (props.orientation === 'vertical' && item.children?.length)" :name="item.trailingIcon || props.trailingIcon || appConfig.ui.icons.chevronDown" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
          <UIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" data-slot="linkTrailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, item.ui?.linkTrailingIcon], active })" />
        </slot>
      </component>
    </slot>
  </DefineLinkTemplate>

  <DefineItemTemplate v-slot="{ item, index, level = 0, listIndex = 0 }">
    <component
      :is="(props.orientation === 'vertical' && !props.collapsed) ? AccordionItem : NavigationMenuItem"
      as="li"
      v-bind="(props.orientation === 'vertical' && !props.collapsed) ? { disabled: !!item.disabled } : {}"
      :value="getItemValue(item, index, level, listIndex)"
    >
      <div v-if="props.orientation === 'vertical' && item.type === 'label' && !props.collapsed" data-slot="label" :class="ui.label({ class: [props.ui?.label, item.ui?.label, item.class] })">
        <ReuseLinkTemplate :item="item" :index="index" />
      </div>
      <ULink v-else-if="item.type !== 'label'" v-slot="{ active, ...slotProps }" v-bind="(props.orientation === 'vertical' && item.children?.length && !props.collapsed && item.type === 'trigger') ? {} : pickLinkProps(item as Omit<NavigationMenuItem, 'type'>)" custom>
        <component
          :is="(props.orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])) ? NavigationMenuTrigger : ((props.orientation === 'vertical' && item.children?.length && !props.collapsed && !(slotProps as any).href) ? AccordionTrigger : NavigationMenuLink)"
          as-child
          :active="active || item.active"
          :disabled="item.disabled"
          @select="item.onSelect"
        >
          <UPopover v-if="props.orientation === 'vertical' && props.collapsed && item.children?.length && (!!props.popover || !!item.popover)" v-bind="{ ...popoverProps, ...(typeof item.popover === 'boolean' ? {} : item.popover || {}) }" :ui="{ content: ui.content({ class: [props.ui?.content, item.ui?.content] }) }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
            </ULinkBase>

            <template #content="{ close }">
              <slot
                :name="((item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>)"
                :item="item"
                :active="active || item.active"
                :index="index"
                :ui="ui"
                :close="close"
              >
                <ul data-slot="childList" :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
                  <li data-slot="childLabel" :class="ui.childLabel({ class: [props.ui?.childLabel, item.ui?.childLabel] })">
                    {{ get(item, props.labelKey as string) }}
                  </li>
                  <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                    <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                      <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                        <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                          <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                          <span data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                            {{ get(childItem, props.labelKey as string) }}

                            <UIcon v-if="childItem.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                          </span>
                        </ULinkBase>
                      </NavigationMenuLink>
                    </ULink>
                  </li>
                </ul>
              </slot>
            </template>
          </UPopover>
          <UTooltip v-else-if="(props.orientation === 'vertical' && props.collapsed && (!!props.tooltip || !!item.tooltip)) || (props.orientation === 'horizontal' && !!item.tooltip)" :text="get(item, props.labelKey as string)" v-bind="{ ...tooltipProps, ...(typeof item.tooltip === 'boolean' ? {} : item.tooltip || {}) }">
            <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: level > 0 })">
              <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
            </ULinkBase>
          </UTooltip>
          <ULinkBase v-else v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: active || item.active, disabled: !!item.disabled, level: props.orientation === 'horizontal' || level > 0 })">
            <ReuseLinkTemplate :item="item" :active="active || item.active" :index="index" />
          </ULinkBase>
        </component>

        <NavigationMenuContent v-if="props.orientation === 'horizontal' && (item.children?.length || !!slots[(item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>])" v-bind="contentProps" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
          <slot :name="((item.slot ? `${item.slot}-content` : 'item-content') as keyof NavigationMenuSlots<T>)" :item="item" :active="active || item.active" :index="index" :ui="ui">
            <ul data-slot="childList" :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })">
              <li v-for="(childItem, childIndex) in item.children" :key="childIndex" data-slot="childItem" :class="ui.childItem({ class: [props.ui?.childItem, item.ui?.childItem] })">
                <ULink v-slot="{ active: childActive, ...childSlotProps }" v-bind="pickLinkProps(childItem)" custom>
                  <NavigationMenuLink as-child :active="childActive" @select="childItem.onSelect">
                    <ULinkBase v-bind="childSlotProps" data-slot="childLink" :class="ui.childLink({ class: [props.ui?.childLink, item.ui?.childLink, childItem.class], active: childActive })">
                      <UIcon v-if="childItem.icon" :name="childItem.icon" data-slot="childLinkIcon" :class="ui.childLinkIcon({ class: [props.ui?.childLinkIcon, item.ui?.childLinkIcon], active: childActive })" />

                      <div data-slot="childLinkWrapper" :class="ui.childLinkWrapper({ class: [props.ui?.childLinkWrapper, item.ui?.childLinkWrapper] })">
                        <p data-slot="childLinkLabel" :class="ui.childLinkLabel({ class: [props.ui?.childLinkLabel, item.ui?.childLinkLabel], active: childActive })">
                          {{ get(childItem, props.labelKey as string) }}

                          <UIcon v-if="childItem.target === '_blank' && props.externalIcon !== false" :name="typeof props.externalIcon === 'string' ? props.externalIcon : appConfig.ui.icons.external" data-slot="childLinkLabelExternalIcon" :class="ui.childLinkLabelExternalIcon({ class: [props.ui?.childLinkLabelExternalIcon, item.ui?.childLinkLabelExternalIcon], active: childActive })" />
                        </p>
                        <p v-if="childItem.description" data-slot="childLinkDescription" :class="ui.childLinkDescription({ class: [props.ui?.childLinkDescription, item.ui?.childLinkDescription], active: childActive })">
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

      <AccordionContent v-if="props.orientation === 'vertical' && item.children?.length && !props.collapsed" data-slot="content" :class="ui.content({ class: [props.ui?.content, item.ui?.content] })">
        <AccordionRoot
          v-bind="({
            ...accordionProps,
            defaultValue: getAccordionDefaultValue(item.children, level + 1, listIndex)
          } as AccordionRootProps)"
          as="ul"
          data-slot="childList"
          :class="ui.childList({ class: [props.ui?.childList, item.ui?.childList] })"
        >
          <ReuseItemTemplate
            v-for="(childItem, childIndex) in item.children"
            :key="childIndex"
            :item="childItem"
            :index="childIndex"
            :level="level + 1"
            :list-index="listIndex"
            data-slot="childItem"
            :class="ui.childItem({ class: [props.ui?.childItem, childItem.ui?.childItem] })"
          />
        </AccordionRoot>
      </AccordionContent>
    </component>
  </DefineItemTemplate>

  <NavigationMenuRoot
    v-bind="{
      ...rootProps,
      ...(props.orientation === 'horizontal' ? {
        modelValue: props.modelValue as string,
        defaultValue: props.defaultValue as string
      } : {}),
      ...$attrs
    }"
    :data-collapsed="props.collapsed"
    data-slot="root"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
  >
    <slot name="list-leading" />

    <template v-for="(list, listIndex) in lists" :key="`list-${listIndex}`">
      <component
        v-bind="props.orientation === 'vertical' && !props.collapsed ? {
          ...accordionProps,
          modelValue: props.modelValue,
          defaultValue: props.defaultValue ?? getAccordionDefaultValue(list, 0, listIndex)
        } : {}"
        :is="props.orientation === 'vertical' ? AccordionRoot : NavigationMenuList"
        as="ul"
        data-slot="list"
        :class="ui.list({ class: props.ui?.list })"
      >
        <ReuseItemTemplate
          v-for="(item, index) in list"
          :key="`list-${listIndex}-${index}`"
          :item="item"
          :index="index"
          :list-index="listIndex"
          data-slot="item"
          :class="ui.item({ class: [props.ui?.item, item.ui?.item] })"
        />
      </component>

      <div v-if="props.orientation === 'vertical' && listIndex < lists.length - 1" data-slot="separator" :class="ui.separator({ class: props.ui?.separator })" />
    </template>

    <slot name="list-trailing" />

    <div v-if="props.orientation === 'horizontal'" data-slot="viewportWrapper" :class="ui.viewportWrapper({ class: props.ui?.viewportWrapper })">
      <NavigationMenuIndicator v-if="props.arrow" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
        <div data-slot="arrow" :class="ui.arrow({ class: props.ui?.arrow })" />
      </NavigationMenuIndicator>

      <NavigationMenuViewport data-slot="viewport" :class="ui.viewport({ class: props.ui?.viewport })" />
    </div>
  </NavigationMenuRoot>
</template>
