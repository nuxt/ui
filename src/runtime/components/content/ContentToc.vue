<script lang="ts">
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui'
import type { TocLink } from '@nuxt/content'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/content/content-toc'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ContentToc = ComponentConfig<typeof theme, AppConfig, 'contentToc'>

export type ContentTocLink = TocLink & {
  class?: any
  ui?: Pick<ContentToc['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkText'>
}

export interface ContentTocProps<T extends ContentTocLink = ContentTocLink> extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open'> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'nav'
   */
  as?: any
  /**
   * The icon displayed to collapse the content.
   * @defaultValue appConfig.ui.icons.chevronDown
   * @IconifyIcon
   */
  trailingIcon?: IconProps['name']
  /**
   * The title of the table of contents.
   * @defaultValue t('contentToc.title')
   */
  title?: string
  /**
   * @defaultValue 'primary'
   */
  color?: ContentToc['variants']['color']
  /**
   * Display a line next to the active link.
   * @defaultValue false
   */
  highlight?: boolean
  /**
   * @defaultValue 'primary'
   */
  highlightColor?: ContentToc['variants']['highlightColor']
  links?: T[]
  class?: any
  ui?: ContentToc['slots']
}

export type ContentTocEmits = CollapsibleRootEmits & {
  move: [id: string]
}

type SlotProps<T> = (props: { link: T }) => any

export interface ContentTocSlots<T extends ContentTocLink = ContentTocLink> {
  leading(props: { open: boolean, ui: ContentToc['ui'] }): any
  default(props: { open: boolean }): any
  trailing(props: { open: boolean, ui: ContentToc['ui'] }): any
  content(props: { links: T[] }): any
  link: SlotProps<T>
  top(props: { links?: T[] }): any
  bottom(props: { links?: T[] }): any
}
</script>

<script setup lang="ts" generic="T extends ContentTocLink">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useRouter, useAppConfig, useNuxtApp } from '#imports'
import { useScrollspy } from '../../composables/useScrollspy'
import { useLocale } from '../../composables/useLocale'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ContentTocProps<T>>(), {
  as: 'nav'
})
const emits = defineEmits<ContentTocEmits>()
const slots = defineSlots<ContentTocSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'open', 'defaultOpen'), emits)

const { t } = useLocale()
const router = useRouter()
const appConfig = useAppConfig() as ContentToc['AppConfig']
const { activeHeadings, updateHeadings } = useScrollspy()

const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate<{ links: T[], level: number }>({
  props: {
    links: Array,
    level: Number
  }
})
const [DefineTriggerTemplate, ReuseTriggerTemplate] = createReusableTemplate<{ open: boolean }>()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentToc || {}) })({
  color: props.color,
  highlight: props.highlight,
  highlightColor: props.highlightColor || props.color
}))

function scrollToHeading(id: string) {
  const encodedId = encodeURIComponent(id)
  router.push(`#${encodedId}`)
  emits('move', id)
}

function flattenLinks(links: T[]): T[] {
  return links.flatMap(link => [link, ...(link.children ? flattenLinks(link.children as T[]) : [])])
}

const indicatorStyle = computed(() => {
  if (!activeHeadings.value?.length) {
    return
  }

  const flatLinks = flattenLinks(props.links || [])
  const activeIndex = flatLinks.findIndex(link => activeHeadings.value.includes(link.id))
  const linkHeight = 28
  const gapSize = 0

  return {
    '--indicator-size': `${(linkHeight * activeHeadings.value.length) + (gapSize * (activeHeadings.value.length - 1))}px`,
    '--indicator-position': activeIndex >= 0 ? `${activeIndex * (linkHeight + gapSize)}px` : '0px'
  }
})

const nuxtApp = useNuxtApp()

nuxtApp.hooks.hook('page:loading:end', () => {
  const headings = Array.from(document.querySelectorAll('h2, h3'))
  updateHeadings(headings)
})
nuxtApp.hooks.hook('page:transition:finish', () => {
  const headings = Array.from(document.querySelectorAll('h2, h3'))
  updateHeadings(headings)
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-template-shadow -->
  <DefineListTemplate v-slot="{ links, level }">
    <ul :class="level > 0 ? ui.listWithChildren({ class: props.ui?.listWithChildren }) : ui.list({ class: props.ui?.list })">
      <li v-for="(link, index) in links" :key="index" :class="link.children && link.children.length > 0 ? ui.itemWithChildren({ class: [props.ui?.itemWithChildren, link.ui?.itemWithChildren] }) : ui.item({ class: [props.ui?.item, link.ui?.item] })">
        <a :href="`#${link.id}`" data-slot="link" :class="ui.link({ class: [props.ui?.link, link.ui?.link, link.class], active: activeHeadings.includes(link.id) })" @click.prevent="scrollToHeading(link.id)">
          <slot name="link" :link="link">
            <span data-slot="linkText" :class="ui.linkText({ class: [props.ui?.linkText, link.ui?.linkText] })">
              {{ link.text }}
            </span>
          </slot>
        </a>

        <ReuseListTemplate v-if="link.children?.length" :links="(link.children as T[])" :level="level + 1" />
      </li>
    </ul>
  </DefineListTemplate>

  <DefineTriggerTemplate v-slot="{ open }">
    <slot name="leading" :open="open" :ui="ui" />

    <span data-slot="title" :class="ui.title({ class: props.ui?.title })">
      <slot :open="open">{{ title || t('contentToc.title') }}</slot>
    </span>

    <span data-slot="trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing" :open="open" :ui="ui">
        <UIcon :name="trailingIcon || appConfig.ui.icons.chevronDown" data-slot="trailingIcon" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </DefineTriggerTemplate>

  <CollapsibleRoot v-slot="{ open }" v-bind="{ ...rootProps, ...$attrs }" :default-open="defaultOpen" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: props.ui?.top })">
        <slot name="top" :links="links" />
      </div>

      <template v-if="links?.length">
        <CollapsibleTrigger data-slot="trigger" :class="ui.trigger({ class: 'lg:hidden' })">
          <ReuseTriggerTemplate :open="open" />
        </CollapsibleTrigger>

        <CollapsibleContent data-slot="content" :class="ui.content({ class: [props.ui?.content, 'lg:hidden'] })">
          <div v-if="highlight" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" :style="indicatorStyle" />

          <slot name="content" :links="links">
            <ReuseListTemplate :links="links" :level="0" />
          </slot>
        </CollapsibleContent>

        <p data-slot="trigger" :class="ui.trigger({ class: 'hidden lg:flex' })">
          <ReuseTriggerTemplate :open="open" />
        </p>

        <div data-slot="content" :class="ui.content({ class: [props.ui?.content, 'hidden lg:flex'] })">
          <div v-if="highlight" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })" :style="indicatorStyle" />

          <slot name="content" :links="links">
            <ReuseListTemplate :links="links" :level="0" />
          </slot>
        </div>
      </template>

      <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: props.ui?.bottom, body: !!slots.top || !!links?.length })">
        <slot name="bottom" :links="links" />
      </div>
    </div>
  </CollapsibleRoot>
</template>
