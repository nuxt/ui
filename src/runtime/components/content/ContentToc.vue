<script lang="ts">
import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui'
import type { VNode } from 'vue'
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
  /**
   * The variant of the highlight indicator.
   * @defaultValue 'straight'
   */
  highlightVariant?: ContentToc['variants']['highlightVariant']
  links?: T[]
  class?: any
  ui?: ContentToc['slots']
}

export type ContentTocEmits = CollapsibleRootEmits & {
  move: [id: string]
}

type SlotProps<T> = (props: { link: T }) => VNode[]

export interface ContentTocSlots<T extends ContentTocLink = ContentTocLink> {
  leading?(props: { open: boolean, ui: ContentToc['ui'] }): VNode[]
  default?(props: { open: boolean }): VNode[]
  trailing?(props: { open: boolean, ui: ContentToc['ui'] }): VNode[]
  content?(props: { links: T[] }): VNode[]
  link?: SlotProps<T>
  top?(props: { links?: T[] }): VNode[]
  bottom?(props: { links?: T[] }): VNode[]
}
</script>

<script setup lang="ts" generic="T extends ContentTocLink">
import { computed } from 'vue'
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent, useForwardPropsEmits } from 'reka-ui'
import { reactivePick, createReusableTemplate } from '@vueuse/core'
import { useRouter, useAppConfig, useNuxtApp } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
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
const uiProp = useComponentUI('contentToc', props)
const { activeHeadings, updateHeadings } = useScrollspy()

const [DefineListTemplate, ReuseListTemplate] = createReusableTemplate<{ links: T[], level: number }>({
  props: {
    links: Array,
    level: Number
  }
})
const [DefineTriggerTemplate, ReuseTriggerTemplate] = createReusableTemplate<{ open: boolean }>()
const [DefineContentTemplate, ReuseContentTemplate] = createReusableTemplate()

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.contentToc || {}) })({
  color: props.color,
  highlight: props.highlight,
  highlightVariant: props.highlightVariant,
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

function flattenLinksWithLevel(links: T[], level = 0): { link: T, level: number }[] {
  return links.flatMap(link => [
    { link, level },
    ...(link.children ? flattenLinksWithLevel(link.children as T[], level + 1) : [])
  ])
}

const linkHeight = 1.75 // rem — text-sm line-height (1.25rem) + py-1 (0.5rem)

const indicatorStyle = computed(() => {
  if (!activeHeadings.value?.length) {
    return
  }

  const flatLinks = flattenLinks(props.links || [])
  const activeIndex = flatLinks.findIndex(link => activeHeadings.value.includes(link.id))

  return {
    '--indicator-size': `${linkHeight * activeHeadings.value.length}rem`,
    '--indicator-position': activeIndex >= 0 ? `${activeIndex * linkHeight}rem` : '0rem'
  }
})

// Generate SVG path for the circuit line structure
const circuitMaskStyle = computed(() => {
  if (!props.highlight || props.highlightVariant !== 'circuit' || !props.links?.length) {
    return
  }

  const flatLinks = flattenLinksWithLevel(props.links)
  const svgUnit = 16 // SVG viewBox units per rem
  const svgLinkHeight = linkHeight * svgUnit
  const svgHeight = flatLinks.length * svgLinkHeight
  const x0 = 0.5
  const x1 = 10.5

  let path = ''
  let currentX = x0
  let y = 0

  flatLinks.forEach((item, index) => {
    const targetX = item.level > 0 ? x1 : x0
    const nextY = y + svgLinkHeight

    if (index === 0) {
      path += `M${targetX} ${y}`
      currentX = targetX
    }

    if (targetX !== currentX) {
      path += ` L${targetX} ${y + 6}`
      currentX = targetX
    }

    path += ` L${currentX} ${nextY - (index < flatLinks.length - 1 && flatLinks[index + 1]?.level !== item.level ? 6 : 0)}`
    y = nextY
  })

  const svgPath = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${svgHeight}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`)

  return {
    width: '0.75rem',
    height: `${flatLinks.length * linkHeight}rem`,
    maskImage: `url("data:image/svg+xml,${svgPath}")`
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
    <ul :class="level > 0 ? ui.listWithChildren({ class: uiProp?.listWithChildren }) : ui.list({ class: uiProp?.list })">
      <li v-for="(link, index) in links" :key="index" :class="link.children && link.children.length > 0 ? ui.itemWithChildren({ class: [uiProp?.itemWithChildren, link.ui?.itemWithChildren] }) : ui.item({ class: [uiProp?.item, link.ui?.item] })">
        <a :href="`#${link.id}`" data-slot="link" :class="ui.link({ class: [uiProp?.link, link.ui?.link, link.class], active: activeHeadings.includes(link.id) })" @click.prevent="scrollToHeading(link.id)">
          <slot name="link" :link="link">
            <span data-slot="linkText" :class="ui.linkText({ class: [uiProp?.linkText, link.ui?.linkText] })">
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

    <span data-slot="title" :class="ui.title({ class: uiProp?.title })">
      <slot :open="open">{{ title || t('contentToc.title') }}</slot>
    </span>

    <span data-slot="trailing" :class="ui.trailing({ class: uiProp?.trailing })">
      <slot name="trailing" :open="open" :ui="ui">
        <UIcon :name="trailingIcon || appConfig.ui.icons.chevronDown" data-slot="trailingIcon" :class="ui.trailingIcon({ class: uiProp?.trailingIcon })" />
      </slot>
    </span>
  </DefineTriggerTemplate>

  <DefineContentTemplate>
    <div v-if="highlight" data-slot="indicator" :class="ui.indicator({ class: uiProp?.indicator })" :style="{ ...indicatorStyle, ...(circuitMaskStyle || {}) }">
      <div data-slot="indicatorLine" :class="ui.indicatorLine({ class: uiProp?.indicatorLine })" />
      <div v-if="indicatorStyle" data-slot="indicatorActive" :class="ui.indicatorActive({ class: uiProp?.indicatorActive })" />
    </div>

    <slot name="content" :links="links!">
      <ReuseListTemplate :links="links!" :level="0" />
    </slot>
  </DefineContentTemplate>

  <CollapsibleRoot v-slot="{ open }" v-bind="{ ...rootProps, ...$attrs }" :default-open="defaultOpen" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <div data-slot="container" :class="ui.container({ class: uiProp?.container })">
      <div v-if="!!slots.top" data-slot="top" :class="ui.top({ class: uiProp?.top })">
        <slot name="top" :links="links" />
      </div>

      <template v-if="links?.length">
        <CollapsibleTrigger data-slot="trigger" :class="ui.trigger({ class: 'lg:hidden' })">
          <ReuseTriggerTemplate :open="open" />
        </CollapsibleTrigger>

        <CollapsibleContent data-slot="content" :class="ui.content({ class: [uiProp?.content, 'lg:hidden'] })">
          <ReuseContentTemplate />
        </CollapsibleContent>

        <p data-slot="trigger" :class="ui.trigger({ class: 'hidden lg:flex' })">
          <ReuseTriggerTemplate :open="open" />
        </p>

        <div data-slot="content" :class="ui.content({ class: [uiProp?.content, 'hidden lg:flex'] })">
          <ReuseContentTemplate />
        </div>
      </template>

      <div v-if="!!slots.bottom" data-slot="bottom" :class="ui.bottom({ class: uiProp?.bottom, body: !!slots.top || !!links?.length })">
        <slot name="bottom" :links="links" />
      </div>
    </div>
  </CollapsibleRoot>
</template>
