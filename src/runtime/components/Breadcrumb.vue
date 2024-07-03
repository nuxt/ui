<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/breadcrumb'
import type { AvatarProps, LinkProps } from '../types'
import type { DynamicSlots } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { breadcrumb: Partial<typeof theme> } }

const breadcrumb = tv({ extend: tv(theme), ...(appConfig.ui?.breadcrumb || {}) })

export interface BreadcrumbItem extends Omit<LinkProps, 'custom'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
}

export interface BreadcrumbProps<T> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  items?: T[]
  /**
   * The icon to use as a separator.
   * @defaultValue appConfig.ui.icons.chevronRight
   */
  separatorIcon?: string
  class?: any
  ui?: Partial<typeof breadcrumb.slots>
}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export type BreadcrumbSlots<T extends { slot?: string }> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'separator'(props?: {}): any
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
import { Primitive } from 'radix-vue'
import { useAppConfig } from '#imports'
import { ULink, UIcon, UAvatar } from '#components'
import { pickLinkProps } from '../utils/link'

const props = defineProps<BreadcrumbProps<T>>()
const slots = defineSlots<BreadcrumbSlots<T>>()

const appConfig = useAppConfig()

// eslint-disable-next-line vue/no-dupe-keys
const ui = breadcrumb()
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" :class="ui.root({ class: props.class })">
    <ol :class="ui.list({ class: props.ui?.list })">
      <template v-for="(item, index) in items" :key="index">
        <li :class="ui.item({ class: props.ui?.item })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <ULinkBase v-bind="slotProps" as="span" :aria-current="active && (index === items!.length - 1) ? 'page' : undefined" :class="ui.link({ class: props.ui?.link, active: index === items!.length - 1, disabled: !!item.disabled, to: !!item.to })">
              <slot :name="item.slot || 'item'" :item="item" :index="index">
                <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="item" :active="index === items!.length - 1" :index="index">
                  <UAvatar v-if="item.avatar" :size="(ui.linkLeadingAvatarSize() as AvatarProps['size'])" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ class: props.ui?.linkLeadingAvatar, active: index === items!.length - 1 })" />
                  <UIcon v-else-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon, active: index === items!.length - 1 })" />
                </slot>

                <span v-if="item.label || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.linkLabel({ class: props.ui?.linkLabel })">
                  <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="item" :active="index === items!.length - 1" :index="index">
                    {{ item.label }}
                  </slot>
                </span>

                <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="item" :active="index === items!.length - 1" :index="index" />
              </slot>
            </ULinkBase>
          </ULink>
        </li>

        <li v-if="index < items!.length - 1" role="presentation" :class="ui.separator({ class: props.ui?.separator })">
          <slot name="separator">
            <UIcon :name="separatorIcon || appConfig.ui.icons.chevronRight" :class="ui.separatorIcon({ class: props.ui?.separatorIcon })" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
