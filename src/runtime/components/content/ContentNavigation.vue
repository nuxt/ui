<script lang="ts">
import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui'
import type { AppConfig } from '@nuxt/schema'
import type { ContentNavigationItem } from '@nuxt/content'
import theme from '#build/ui/content/content-navigation'
import type { BadgeProps, IconProps, LinkProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ContentNavigation = ComponentConfig<typeof theme, AppConfig, 'contentNavigation'>

export interface ContentNavigationLink extends ContentNavigationItem {
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * Display a badge on the link.
   * `{ color: 'neutral', variant: 'outline', size: 'sm' }`{lang="ts-type"}
   */
  badge?: string | number | BadgeProps
  target?: LinkProps['target']
  /**
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  disabled?: boolean
  children?: ContentNavigationLink[]
  defaultOpen?: boolean
  active?: boolean
  class?: any
  ui?: Pick<ContentNavigation['slots'], 'link' | 'linkLeadingIcon' | 'linkTitle' | 'linkTrailing' | 'linkTrailingIcon' | 'linkTrailingBadge' | 'linkTrailingBadgeSize' | 'linkTrailingIcon' | 'linkTitleExternalIcon' | 'trigger' | 'content' | 'item' | 'itemWithChildren'>
}

export interface ContentNavigationProps<T extends ContentNavigationLink = ContentNavigationLink> extends Pick<AccordionRootProps, 'disabled' | 'type' | 'unmountOnHide'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any
  /**
   * When `true`, the tree will be opened based on the current route.
   * When `false`, the tree will be closed.
   * When `undefined` (default), the first item will be opened with `type="single"` and the first level will be opened with `type="multiple"`.
   */
  defaultOpen?: boolean
  /**
   * The icon displayed to toggle the accordion.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * @defaultValue 'primary'
   */
  color?: ContentNavigation['variants']['color']
  /**
   * @defaultValue 'pill'
   */
  variant?: ContentNavigation['variants']['variant']
  /**
   * Display a line next to the active link.
   * @defaultValue false
   */
  highlight?: boolean
  /**
   * @defaultValue 'primary'
   */
  highlightColor?: ContentNavigation['variants']['highlightColor']
  /**
   * When type is "single", prevents closing the open item when clicking its trigger.
   * When type is "multiple", disables the collapsible behavior.
   * @defaultValue true
   */
  collapsible?: boolean
  level?: number
  navigation?: T[]
  class?: any
  ui?: ContentNavigation['slots']
}

export interface ContentNavigationEmits extends AccordionRootEmits {}

type SlotProps<T> = (props: { link: T, active?: boolean }) => any

export interface ContentNavigationSlots<T extends ContentNavigationLink = ContentNavigationLink> {
  'link': SlotProps<T>
  'link-leading': SlotProps<T>
  'link-title': SlotProps<T>
  'link-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends ContentNavigationLink">
import { computed } from 'vue'
import { Primitive, AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useRoute, useAppConfig } from '#imports'
import { pickLinkProps } from '../../utils/link'
import { tv } from '../../utils/tv'
import { mapContentNavigationItem } from '../../utils/content'
import UContentNavigation from './ContentNavigation.vue'
import ULink from '../Link.vue'
import ULinkBase from '../LinkBase.vue'
import UBadge from '../Badge.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContentNavigationProps<T>>(), {
  as: 'nav',
  defaultOpen: undefined,
  level: 0,
  type: 'multiple',
  collapsible: true,
  highlight: false,
  unmountOnHide: true
})
const emits = defineEmits<ContentNavigationEmits>()
const slots = defineSlots<ContentNavigationSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'collapsible', 'type', 'unmountOnHide'), emits)

const route = useRoute()
const appConfig = useAppConfig() as ContentNavigation['AppConfig']

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ link: ContentNavigationLink, active?: boolean }>()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentNavigation || {}) })({
  color: props.color,
  variant: props.variant,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}))

const disabled = computed(() => props.disabled || (props.type === 'multiple' && props.collapsible === false))

function isRouteInTree(link: ContentNavigationLink, routePath: string): boolean {
  if (link.children?.length) {
    return link.children.some(child => isRouteInTree(child, routePath))
  }
  return routePath === link.path
}

const defaultValue = computed(() => {
  // When `defaultOpen` is `false`, return `undefined` to close all items
  if (props.defaultOpen === false) {
    return undefined
  }
  // When `defaultOpen` is `undefined`, open the first item or the first level
  if (props.defaultOpen === undefined) {
    return props.type === 'single' ? '0' : props.navigation?.map((link, index) => link.defaultOpen !== false && String(index)).filter(Boolean) as string[]
  }
  // When `defaultOpen` is `true`, open items based on the current route
  const indices = props.navigation?.reduce((acc, link, index) => {
    if (isRouteInTree(link, route.path)) {
      acc.push(String(index))
    }
    return acc
  }, [] as string[]) || []

  return props.type === 'multiple' ? indices : indices[0]
})
</script>

<template>
  <DefineLinkTemplate v-slot="{ link, active }">
    <slot name="link" :link="(link as T)" :active="active">
      <slot name="link-leading" :link="(link as T)" :active="active">
        <UIcon v-if="link.icon" :name="link.icon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
      </slot>

      <span v-if="link.title || !!slots['link-title']" :class="ui.linkTitle({ class: [props.ui?.linkTitle, link.ui?.linkTitle], active })">
        <slot name="link-title" :link="(link as T)" :active="active">
          {{ link.title }}
        </slot>

        <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.linkTitleExternalIcon({ class: [props.ui?.linkTitleExternalIcon, link.ui?.linkTitleExternalIcon], active })" />
      </span>

      <span v-if="link.badge || (link.children?.length && !disabled) || link.trailingIcon || !!slots['link-trailing']" :class="ui.linkTrailing({ class: [props.ui?.linkTrailing, link.ui?.linkTrailing] })">
        <slot name="link-trailing" :link="(link as T)" :active="active">
          <UBadge
            v-if="link.badge"
            color="neutral"
            variant="outline"
            :size="((props.ui?.linkTrailingBadgeSize || ui.linkTrailingBadgeSize()) as BadgeProps['size'])"
            v-bind="(typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge"
            :class="ui.linkTrailingBadge({ class: props.ui?.linkTrailingBadge })"
          />
          <UIcon v-if="link.children?.length && !disabled" :name="link.trailingIcon || trailingIcon || appConfig.ui.icons.chevronDown" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })" />
          <UIcon v-else-if="link.trailingIcon" :name="link.trailingIcon" :class="ui.linkTrailingIcon({ class: [props.ui?.linkTrailingIcon, link.ui?.linkTrailingIcon] })" />
        </slot>
      </span>
    </slot>
  </DefineLinkTemplate>

  <Primitive :as="as" v-bind="$attrs" :as-child="level > 0" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <AccordionRoot as="ul" :disabled="disabled" v-bind="rootProps" :default-value="defaultValue" :class="level > 0 ? ui.listWithChildren({ class: props.ui?.listWithChildren }) : ui.list({ class: props.ui?.list })">
      <template v-for="(link, index) in navigation" :key="index">
        <AccordionItem v-if="link.children?.length" as="li" :class="ui.itemWithChildren({ class: [props.ui?.itemWithChildren, link.ui?.itemWithChildren], level: level > 0 })" :value="String(index)">
          <AccordionTrigger
            as="button"
            :class="[
              ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active: link.active, disabled: !!link.disabled || disabled }),
              ui.trigger({ class: [props.ui?.trigger, link.ui?.trigger], disabled })
            ]"
          >
            <ReuseLinkTemplate :link="link" :active="link.active" />
          </AccordionTrigger>

          <AccordionContent :class="ui.content({ class: [props.ui?.content, link.ui?.content] })">
            <UContentNavigation
              v-bind="rootProps"
              :navigation="link.children"
              :default-open="defaultOpen"
              :level="level + 1"
              :trailing-icon="trailingIcon"
              :color="color"
              :variant="variant"
              :highlight="highlight"
              :highlight-color="highlightColor"
              :ui="props.ui"
            >
              <template v-for="(_, name) in slots" #[name]="slotData">
                <slot :name="name" :link="(slotData.link as T)" :active="slotData.active" />
              </template>
            </UContentNavigation>
          </AccordionContent>
        </AccordionItem>

        <li v-else :class="ui.item({ class: [props.ui?.item, link.ui?.item], level: level > 0 })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(mapContentNavigationItem(link))" custom>
            <ULinkBase v-bind="slotProps" :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active, disabled: !!link.disabled, level: level > 0 })">
              <ReuseLinkTemplate :link="link" :active="active" />
            </ULinkBase>
          </ULink>
        </li>
      </template>
    </AccordionRoot>
  </Primitive>
</template>
