<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/breadcrumb'
import type { AvatarProps, IconProps, LinkProps } from '../types'
import type { DynamicSlots, GetItemKeys } from '../types/utils'
import type { ComponentConfig } from '../types/tv'

type Breadcrumb = ComponentConfig<typeof theme, AppConfig, 'breadcrumb'>

export interface BreadcrumbItem extends Omit<LinkProps, 'raw' | 'custom'> {
  label?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  avatar?: AvatarProps
  slot?: string
  class?: any
  ui?: Pick<Breadcrumb['slots'], 'item' | 'link' | 'linkLeadingIcon' | 'linkLeadingAvatar' | 'linkLabel' | 'separator' | 'separatorIcon'>
  [key: string]: any
}

export interface BreadcrumbProps<T extends BreadcrumbItem = BreadcrumbItem> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any
  items?: T[]
  /**
   * The icon to use as a separator.
   * @defaultValue appConfig.ui.icons.chevronRight
   * @IconifyIcon
   */
  separatorIcon?: IconProps['name']
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: GetItemKeys<T>
  class?: any
  ui?: Breadcrumb['slots']
}

type SlotProps<T extends BreadcrumbItem> = (props: { item: T, index: number, active?: boolean, ui: Breadcrumb['ui'] }) => any

export type BreadcrumbSlots<T extends BreadcrumbItem = BreadcrumbItem> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': (props: { item: T, index: number, active?: boolean }) => any
  'item-trailing': (props: { item: T, index: number, active?: boolean }) => any
  'separator': (props: { ui: Breadcrumb['ui'] }) => any
}
& DynamicSlots<T, 'leading', { index: number, active?: boolean, ui: Breadcrumb['ui'] }>
& DynamicSlots<T, 'label' | 'trailing', { index: number, active?: boolean }>

</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { get } from '../utils'
import { tv } from '../utils/tv'
import { pickLinkProps } from '../utils/link'
import UIcon from './Icon.vue'
import UAvatar from './Avatar.vue'
import ULinkBase from './LinkBase.vue'
import ULink from './Link.vue'

const props = withDefaults(defineProps<BreadcrumbProps<T>>(), {
  as: 'nav',
  labelKey: 'label'
})
const slots = defineSlots<BreadcrumbSlots<T>>()

const { dir } = useLocale()
const appConfig = useAppConfig() as Breadcrumb['AppConfig']

const separatorIcon = computed(() => props.separatorIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.breadcrumb || {}) })())
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ol data-slot="list" :class="ui.list({ class: props.ui?.list })">
      <template v-for="(item, index) in items" :key="index">
        <li data-slot="item" :class="ui.item({ class: [props.ui?.item, item.ui?.item] })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <ULinkBase v-bind="slotProps" as="span" :aria-current="(item.active ?? active) && (index === items!.length - 1) ? 'page' : undefined" data-slot="link" :class="ui.link({ class: [props.ui?.link, item.ui?.link, item.class], active: item.active ?? (index === items!.length - 1), disabled: !!item.disabled, to: !!item.to })">
              <slot :name="((item.slot || 'item') as keyof BreadcrumbSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :active="item.active ?? (index === items!.length - 1)" :index="index" :ui="ui">
                <slot :name="((item.slot ? `${item.slot}-leading`: 'item-leading') as keyof BreadcrumbSlots<T>)" :item="(item as Extract<T, { slot: string; }>)" :active="item.active ?? (index === items!.length - 1)" :index="index" :ui="ui">
                  <UIcon v-if="item.icon" :name="item.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, item.ui?.linkLeadingIcon], active: item.active ?? (index === items!.length - 1) })" />
                  <UAvatar v-else-if="item.avatar" :size="((props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" data-slot="linkLeadingAvatar" :class="ui.linkLeadingAvatar({ class: [props.ui?.linkLeadingAvatar, item.ui?.linkLeadingAvatar], active: item.active ?? (index === items!.length - 1) })" />
                </slot>

                <span v-if="get(item, props.labelKey as string) || !!slots[(item.slot ? `${item.slot}-label`: 'item-label') as keyof BreadcrumbSlots<T>]" data-slot="linkLabel" :class="ui.linkLabel({ class: [props.ui?.linkLabel, item.ui?.linkLabel] })">
                  <slot :name="((item.slot ? `${item.slot}-label`: 'item-label') as keyof DynamicSlots<T, 'label'>)" :item="(item as Extract<T, { slot: string; }>)" :active="item.active ?? (index === items!.length - 1)" :index="index">
                    {{ get(item, props.labelKey as string) }}
                  </slot>
                </span>

                <slot :name="((item.slot ? `${item.slot}-trailing`: 'item-trailing') as keyof DynamicSlots<T, 'trailing'>)" :item="(item as Extract<T, { slot: string; }>)" :active="item.active ?? (index === items!.length - 1)" :index="index" />
              </slot>
            </ULinkBase>
          </ULink>
        </li>

        <li v-if="index < items!.length - 1" role="presentation" aria-hidden="true" data-slot="separator" :class="ui.separator({ class: [props.ui?.separator, item.ui?.separator] })">
          <slot name="separator" :ui="ui">
            <UIcon :name="separatorIcon" data-slot="separatorIcon" :class="ui.separatorIcon({ class: [props.ui?.separatorIcon, item.ui?.separatorIcon] })" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
