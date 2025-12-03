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

type SlotProps<T> = (props: { link: T, active: boolean, ui: FooterColumns['ui'] }) => any

export interface FooterColumnsSlots<T extends FooterColumnLink = FooterColumnLink> {
  'left'(props?: {}): any
  'default'(props?: {}): any
  'right'(props?: {}): any
  'column-label'?: (props: { column: FooterColumn<T> }) => any
  'link': SlotProps<T>
  'link-leading': SlotProps<T>
  'link-label'(props: { link: T, active: boolean }): any
  'link-trailing'(props: { link: T, active: boolean }): any
}
</script>

<script setup lang="ts" generic="T extends FooterColumnLink">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
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

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.footerColumns || {}) })())
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.left" data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <slot name="left" />
    </div>

    <div v-if="!!slots.default || columns?.length" data-slot="center" :class="ui.center({ class: props.ui?.center })">
      <slot>
        <div v-for="(column, index) in columns" :key="index">
          <h3 data-slot="label" :class="ui.label({ class: props.ui?.label })">
            <slot name="column-label" :column="column">
              {{ column.label }}
            </slot>
          </h3>

          <ul data-slot="list" :class="ui.list({ class: props.ui?.list })">
            <li v-for="(link, linkIndex) in column.children" :key="linkIndex" data-slot="item" :class="ui.item({ class: [props.ui?.item, link.ui?.item] })">
              <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
                <ULinkBase v-bind="slotProps" data-slot="link" :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active })">
                  <slot name="link" :link="(link as T)" :active="active" :ui="ui">
                    <slot name="link-leading" :link="(link as T)" :active="active" :ui="ui">
                      <UIcon v-if="link.icon" :name="link.icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
                    </slot>

                    <span v-if="link.label || !!slots['link-label']" data-slot="linkLabel" :class="ui.linkLabel({ class: [props.ui?.linkLabel, link.ui?.linkLabel], active })">
                      <slot name="link-label" :link="(link as T)" :active="active">
                        {{ (link as T).label }}
                      </slot>

                      <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [props.ui?.linkLabelExternalIcon, link.ui?.linkLabelExternalIcon], active })" />
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

    <div v-if="!!slots.right" data-slot="right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />
    </div>
  </Primitive>
</template>
