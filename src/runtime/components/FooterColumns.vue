<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/footer-columns'
import type { IconProps, LinkProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type FooterColumns = ComponentConfig<typeof theme, AppConfig, 'footerColumns'>

export interface FooterColumnLink extends Omit<LinkProps, 'custom'> {
  label: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  class?: any
  ui?: Pick<FooterColumns['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeadingIcon'>
}

export interface FooterColumn<T extends FooterColumnLink = FooterColumnLink> {
  label: string
  children?: T[]
}

export interface FooterColumnsProps<T extends FooterColumnLink = FooterColumnLink> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  class?: any
  columns?: FooterColumn<T>[]
  ui?: FooterColumns['slots']
}

type SlotProps<T> = (props: { link: T, active: boolean }) => any

export interface FooterColumnsSlots<T extends FooterColumnLink = FooterColumnLink> {
  'left'(props?: {}): any
  'default'(props?: {}): any
  'right'(props?: {}): any
  'column-label'?: (props: { column: FooterColumn<T> }) => any
  'link': SlotProps<T>
  'link-leading': SlotProps<T>
  'link-label': SlotProps<T>
  'link-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends FooterColumnLink">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig, useComponentUiTheme } from '#imports'
import { pickLinkProps } from '../utils/link'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import ULinkBase from './LinkBase.vue'
import UIcon from './Icon.vue'

const props = withDefaults(defineProps<FooterColumnsProps<T>>(), {
  as: 'nav'
})
const slots = defineSlots<FooterColumnsSlots<T>>()

const appConfig = useAppConfig() as FooterColumns['AppConfig']
const uiTheme = useComponentUiTheme('footerColumns', () => ({ slots: props.ui }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.footerColumns || {}) })())
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [uiTheme?.slots?.root, props.class] })">
    <div v-if="!!slots.left" :class="ui.left({ class: uiTheme?.slots?.left })">
      <slot name="left" />
    </div>

    <div v-if="!!slots.default || columns?.length" :class="ui.center({ class: uiTheme?.slots?.center })">
      <slot>
        <div v-for="(column, index) in columns" :key="index">
          <h3 :class="ui.label({ class: uiTheme?.slots?.label })">
            <slot name="column-label" :column="column">
              {{ column.label }}
            </slot>
          </h3>

          <ul :class="ui.list({ class: uiTheme?.slots?.list })">
            <li v-for="(link, linkIndex) in column.children" :key="linkIndex" :class="ui.item({ class: [uiTheme?.slots?.item, link.ui?.item] })">
              <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
                <ULinkBase v-bind="slotProps" :class="ui.link({ class: [uiTheme?.slots?.link, link.ui?.link, link.class], active })">
                  <slot name="link" :link="(link as T)" :active="active">
                    <slot name="link-leading" :link="(link as T)" :active="active">
                      <UIcon v-if="link.icon" :name="link.icon" :class="ui.linkLeadingIcon({ class: [uiTheme?.slots?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
                    </slot>

                    <span v-if="link.label || !!slots['link-label']" :class="ui.linkLabel({ class: [uiTheme?.slots?.linkLabel, link.ui?.linkLabel], active })">
                      <slot name="link-label" :link="(link as T)" :active="active">
                        {{ (link as T).label }}
                      </slot>

                      <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" :class="ui.linkLabelExternalIcon({ class: [uiTheme?.slots?.linkLabelExternalIcon, link.ui?.linkLabelExternalIcon], active })" />
                    </span>

                    <slot name="link-trailing" :link="(link as T)" :active="active" />
                  </slot>
                </ULinkBase>
              </ULink>
            </li>
          </ul>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.right" :class="ui.right({ class: uiTheme?.slots?.right })">
      <slot name="right" />
    </div>
  </Primitive>
</template>
