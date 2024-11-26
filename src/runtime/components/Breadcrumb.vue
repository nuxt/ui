<script lang="ts">
import { tv } from 'tailwind-variants'
import type { AppConfig } from '@nuxt/schema'
import _appConfig from '#build/app.config'
import theme from '#build/ui/breadcrumb'
import { extendDevtoolsMeta } from '../composables/extendDevtoolsMeta'
import type { AvatarProps, LinkProps } from '../types'
import type { DynamicSlots, PartialString } from '../types/utils'

const appConfig = _appConfig as AppConfig & { ui: { breadcrumb: Partial<typeof theme> } }

const breadcrumb = tv({ extend: tv(theme), ...(appConfig.ui?.breadcrumb || {}) })

export interface BreadcrumbItem extends Omit<LinkProps, 'raw' | 'custom'> {
  label?: string
  icon?: string
  avatar?: AvatarProps
  slot?: string
}

export interface BreadcrumbProps<T> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any
  items?: T[]
  /**
   * The icon to use as a separator.
   * @defaultValue appConfig.ui.icons.chevronRight
   */
  separatorIcon?: string
  /**
   * The key used to get the label from the item.
   * @defaultValue 'label'
   */
  labelKey?: string
  class?: any
  ui?: PartialString<typeof breadcrumb.slots>
}

type SlotProps<T> = (props: { item: T, index: number, active?: boolean }) => any

export type BreadcrumbSlots<T extends { slot?: string }> = {
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
  'separator'(props?: {}): any
} & DynamicSlots<T, SlotProps<T>>

extendDevtoolsMeta({
  defaultProps: {
    items: [
      { label: 'Home', to: '/' },
      {
        slot: 'dropdown',
        icon: 'i-lucide-ellipsis',
        children: [{
          label: 'Documentation'
        }, {
          label: 'Themes'
        }, {
          label: 'GitHub'
        }]
      }, {
        label: 'Components',
        disabled: true
      }, {
        label: 'Breadcrumb',
        to: '/components/breadcrumb'
      }
    ]
  }
})
</script>

<script setup lang="ts" generic="T extends BreadcrumbItem">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useLocale } from '../composables/useLocale'
import { get } from '../utils'
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
const appConfig = useAppConfig()

const separatorIcon = computed(() => props.separatorIcon || (dir.value === 'rtl' ? appConfig.ui.icons.chevronLeft : appConfig.ui.icons.chevronRight))

// eslint-disable-next-line vue/no-dupe-keys
const ui = breadcrumb()
</script>

<template>
  <Primitive :as="as" aria-label="breadcrumb" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <ol :class="ui.list({ class: props.ui?.list })">
      <template v-for="(item, index) in items" :key="index">
        <li :class="ui.item({ class: props.ui?.item })">
          <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(item)" custom>
            <ULinkBase v-bind="slotProps" as="span" :aria-current="active && (index === items!.length - 1) ? 'page' : undefined" :class="ui.link({ class: [props.ui?.link, item.class], active: index === items!.length - 1, disabled: !!item.disabled, to: !!item.to })">
              <slot :name="item.slot || 'item'" :item="item" :index="index">
                <slot :name="item.slot ? `${item.slot}-leading`: 'item-leading'" :item="item" :active="index === items!.length - 1" :index="index">
                  <UIcon v-if="item.icon" :name="item.icon" :class="ui.linkLeadingIcon({ class: props.ui?.linkLeadingIcon, active: index === items!.length - 1 })" />
                  <UAvatar v-else-if="item.avatar" :size="((props.ui?.linkLeadingAvatarSize || ui.linkLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.linkLeadingAvatar({ class: props.ui?.linkLeadingAvatar, active: index === items!.length - 1 })" />
                </slot>

                <span v-if="get(item, props.labelKey as string) || !!slots[item.slot ? `${item.slot}-label`: 'item-label']" :class="ui.linkLabel({ class: props.ui?.linkLabel })">
                  <slot :name="item.slot ? `${item.slot}-label`: 'item-label'" :item="item" :active="index === items!.length - 1" :index="index">
                    {{ get(item, props.labelKey as string) }}
                  </slot>
                </span>

                <slot :name="item.slot ? `${item.slot}-trailing`: 'item-trailing'" :item="item" :active="index === items!.length - 1" :index="index" />
              </slot>
            </ULinkBase>
          </ULink>
        </li>

        <li v-if="index < items!.length - 1" role="presentation" aria-hidden="true" :class="ui.separator({ class: props.ui?.separator })">
          <slot name="separator">
            <UIcon :name="separatorIcon" :class="ui.separatorIcon({ class: props.ui?.separatorIcon })" />
          </slot>
        </li>
      </template>
    </ol>
  </Primitive>
</template>
