<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/page-links'
import type { IconProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type PageLinks = ComponentConfig<typeof theme, AppConfig, 'pageLinks'>

export interface PageLink extends Omit<LinkProps, 'custom'> {
  label: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  class?: any
  ui?: Pick<PageLinks['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeadingIcon'>
}

export interface PageLinksProps<T extends PageLink = PageLink> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any
  title?: string
  links?: T[]
  class?: any
  ui?: PageLinks['slots']
}

type SlotProps<T> = (props: { link: T, active: boolean }) => any

export interface PageLinksSlots<T extends PageLink = PageLink> {
  'title'(props?: {}): any
  'link': SlotProps<T>
  'link-leading': SlotProps<T>
  'link-label': SlotProps<T>
  'link-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends PageLink">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig, useComponentUiTheme } from '#imports'
import { pickLinkProps } from '../utils/link'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import ULinkBase from './LinkBase.vue'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<PageLinksProps<T>>(), {
  as: 'nav'
})
const slots = defineSlots<PageLinksSlots<T>>()

const appConfig = useAppConfig() as PageLinks['AppConfig']
const uiTheme = useComponentUiTheme('pageLinks', () => ({ slots: props.ui }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.pageLinks || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <p v-if="title || !!slots.title" :class="ui.title({ class: uiTheme?.slots?.title })">
      <slot name="title">
        {{ title }}
      </slot>
    </p>

    <ul :class="ui.list({ class: uiTheme?.slots?.list })">
      <li v-for="(link, index) in links" :key="index" :class="ui.item({ class: [uiTheme?.slots?.item, link.ui?.item] })">
        <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
          <ULinkBase v-bind="slotProps" :class="ui.link({ class: [uiTheme?.slots?.link, link.ui?.link, link.class], active })">
            <slot name="link" :link="link" :active="active">
              <slot name="link-leading" :link="link" :active="active">
                <UIcon v-if="link.icon" :name="link.icon" :class="ui.linkLeadingIcon({ class: [uiTheme?.slots?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
              </slot>

              <span v-if="link.label || !!slots['link-label']" :class="ui.linkLabel({ class: [uiTheme?.slots?.linkLabel, link.ui?.linkLabel], active })">
                <slot name="link-label" :link="link" :active="active">
                  {{ link.label }}
                </slot>

                <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.linkLabelExternalIcon({ class: [uiTheme?.slots?.linkLabelExternalIcon, link.ui?.linkLabelExternalIcon], active })" />
              </span>

              <slot name="link-trailing" :link="link" :active="active" />
            </slot>
          </ULinkBase>
        </ULink>
      </li>
    </ul>
  </Primitive>
</template>
