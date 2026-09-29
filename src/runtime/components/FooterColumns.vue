<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '../theme/footer-columns'
import type { IconProps } from './Icon.vue'
import type { LinkProps } from './Link.vue'
import type { ComponentConfig } from '../types/tv'

type FooterColumns = ComponentConfig<typeof theme, AppConfig, 'footerColumns'>

export interface FooterColumnLink extends Omit<LinkProps, 'custom' | 'ui'> {
  label: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  class?: any
  ui?: Partial<Pick<FooterColumns['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeadingIcon'>>
}

export interface FooterColumn<T extends FooterColumnLink = FooterColumnLink> {
  label: string
  children?: T[]
}

export interface FooterColumnsProps<T extends FooterColumnLink = FooterColumnLink> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any | { root?: any, label?: any }
  class?: any
  columns?: FooterColumn<T>[]
  ui?: FooterColumns['slots']
}

type SlotProps<T> = (props: { link: T, active: boolean, ui: FooterColumns['ui'] }) => VNode[]

export interface FooterColumnsSlots<T extends FooterColumnLink = FooterColumnLink> {
  'left'?(props?: {}): VNode[]
  'default'?(props?: {}): VNode[]
  'right'?(props?: {}): VNode[]
  'column-label'?: (props: { column: FooterColumn<T> }) => VNode[]
  'link'?: SlotProps<T>
  'link-leading'?: SlotProps<T>
  'link-label'?(props: { link: T, active: boolean }): VNode[]
  'link-trailing'?(props: { link: T, active: boolean }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends FooterColumnLink">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useComponentProps, useComponentOverrides, useThemeConfig } from '../composables/useComponentProps'
import { pickLinkProps } from '../utils/link'
import { resolveAs } from '../utils'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import ULinkBase from './LinkBase.vue'
import UIcon from './Icon.vue'

const _props = defineProps<FooterColumnsProps<T>>()
const slots = defineSlots<FooterColumnsSlots<T>>()

const props = useComponentProps<FooterColumnsProps<T>>('footerColumns', _props, theme)

const appConfig = useThemeConfig() as FooterColumns['AppConfig']
const overrides = useComponentOverrides(() => appConfig.ui?.footerColumns)

// eslint-disable-next-line vue/no-dupe-keys
const as = computed(() => resolveAs(props.as, { root: 'nav', label: 'h3' }))

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)())
</script>

<template>
  <Primitive :as="as.root" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div v-if="!!slots.left" data-slot="left" :class="ui.left({ class: props.ui?.left })">
      <slot name="left" />
    </div>

    <div v-if="!!slots.default || props.columns?.length" data-slot="footer-columns-center" :class="ui.center({ class: props.ui?.center })">
      <slot>
        <div v-for="(column, index) in props.columns" :key="index">
          <Primitive :as="as.label" data-slot="label" :class="ui.label({ class: props.ui?.label })">
            <slot name="column-label" :column="column">
              {{ column.label }}
            </slot>
          </Primitive>

          <ul data-slot="footer-columns-list" :class="ui.list({ class: props.ui?.list })">
            <li v-for="(link, linkIndex) in column.children" :key="linkIndex" data-slot="footer-columns-item" :class="ui.item({ class: [props.ui?.item, link.ui?.item] })">
              <ULink v-slot="{ active, ...slotProps }" v-bind="pickLinkProps(link)" custom>
                <ULinkBase v-bind="slotProps" data-slot="footer-columns-link" :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active })">
                  <slot name="link" :link="(link as T)" :active="active" :ui="ui">
                    <slot name="link-leading" :link="(link as T)" :active="active" :ui="ui">
                      <UIcon v-if="link.icon" :name="link.icon" data-slot="footer-columns-linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], active })" />
                    </slot>

                    <span v-if="link.label || !!slots['link-label']" data-slot="footer-columns-linkLabel" :class="ui.linkLabel({ class: [props.ui?.linkLabel, link.ui?.linkLabel], active })">
                      <slot name="link-label" :link="(link as T)" :active="active">
                        {{ (link as T).label }}
                      </slot>

                      <UIcon v-if="link.target === '_blank'" :name="appConfig.ui.icons.external" data-slot="footer-columns-linkLabelExternalIcon" :class="ui.linkLabelExternalIcon({ class: [props.ui?.linkLabelExternalIcon, link.ui?.linkLabelExternalIcon], active })" />
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

    <div v-if="!!slots.right" data-slot="footer-columns-right" :class="ui.right({ class: props.ui?.right })">
      <slot name="right" />
    </div>
  </Primitive>
</template>
