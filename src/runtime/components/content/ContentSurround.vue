<script lang="ts">
import type { PropType } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/content/content-surround'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ContentSurround = ComponentConfig<typeof theme, AppConfig, 'contentSurround'>

export interface ContentSurroundLink extends ContentNavigationItem {
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  class?: any
  ui?: Pick<ContentSurround['slots'], 'link' | 'linkLeading' | 'linkLeadingIcon' | 'linkTitle' | 'linkDescription'>
}

export interface ContentSurroundProps<T extends ContentSurroundLink = ContentSurroundLink> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The icon displayed in the prev link.
   * @defaultValue appConfig.ui.icons.arrowLeft
   * @IconifyIcon
   */
  prevIcon?: IconProps['name']
  /**
   * The icon displayed in the next link.
   * @defaultValue appConfig.ui.icons.arrowRight
   * @IconifyIcon
   */
  nextIcon?: IconProps['name']
  surround?: T[]
  class?: any
  ui?: ContentSurround['slots']
}

type SlotProps<T> = (props: { link: T, ui: ContentSurround['ui'] }) => any

export interface ContentSurroundSlots<T extends ContentSurroundLink = ContentSurroundLink> {
  'link': SlotProps<T>
  'link-leading': SlotProps<T>
  'link-title': SlotProps<T>
  'link-description': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends ContentSurroundLink">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { tv } from '../../utils/tv'
import ULink from '../Link.vue'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ContentSurroundProps<T>>()
defineSlots<ContentSurroundSlots<T>>()

const appConfig = useAppConfig() as ContentSurround['AppConfig']

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate<{ link?: ContentSurroundLink, icon: IconProps['name'], direction: 'left' | 'right' }>({
  props: {
    link: Object,
    icon: String,
    direction: String as PropType<'left' | 'right'>
  }
})

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentSurround || {}) })())
</script>

<template>
  <DefineLinkTemplate v-slot="{ link, icon, direction }">
    <ULink v-if="link" :to="link.path" raw data-slot="link" :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], direction })">
      <slot name="link" :link="(link as T)" :ui="ui">
        <div data-slot="linkLeading" :class="ui.linkLeading({ class: [props.ui?.linkLeading, link.ui?.linkLeading] })">
          <slot name="link-leading" :link="(link as T)" :ui="ui">
            <UIcon :name="link.icon || icon" data-slot="linkLeadingIcon" :class="ui.linkLeadingIcon({ class: [props.ui?.linkLeadingIcon, link.ui?.linkLeadingIcon], direction })" />
          </slot>
        </div>

        <p data-slot="linkTitle" :class="ui.linkTitle({ class: [props.ui?.linkTitle, link.ui?.linkTitle] })">
          <slot name="link-title" :link="(link as T)" :ui="ui">
            {{ link.title }}
          </slot>
        </p>

        <p data-slot="linkDescription" :class="ui.linkDescription({ class: [props.ui?.linkDescription, link.ui?.linkDescription] })">
          <slot name="link-description" :link="(link as T)" :ui="ui">
            {{ link.description }}
          </slot>
        </p>
      </slot>
    </ULink>
    <span v-else class="hidden lg:block">&nbsp;</span>
  </DefineLinkTemplate>

  <Primitive v-if="surround" :as="as" v-bind="$attrs" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <ReuseLinkTemplate :link="surround[0]" :icon="prevIcon || appConfig.ui.icons.arrowLeft" direction="left" />
    <ReuseLinkTemplate :link="surround[1]" :icon="nextIcon || appConfig.ui.icons.arrowRight" direction="right" />
  </Primitive>
</template>
