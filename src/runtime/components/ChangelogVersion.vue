<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/changelog-version'
import type { BadgeProps, LinkProps, UserProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type ChangelogVersion = ComponentConfig<typeof theme, AppConfig, 'changelogVersion'>

export interface ChangelogVersionProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'article'
   */
  as?: any
  title?: string
  description?: string
  /** The date of the changelog version. Can be a string or a Date object. */
  date?: string | Date
  /**
   * Display a badge on the changelog version.
   * Can be a string or an object.
   * `{ color: 'neutral', variant: 'solid' }`{lang="ts-type"}
   */
  badge?: string | BadgeProps
  /** The authors of the changelog version. */
  authors?: UserProps[]
  /** The image of the changelog version. Can be a string or an object. */
  image?: string | (Partial<HTMLImageElement> & { [key: string]: any })
  /**
   * Display an indicator dot on the left.
   * @defaultValue true
   */
  indicator?: boolean
  to?: LinkProps['to']
  target?: LinkProps['target']
  onClick?: (event: MouseEvent) => void | Promise<void>
  class?: any
  ui?: ChangelogVersion['slots']
}

export interface ChangelogVersionSlots {
  header(props?: {}): any
  badge(props: { ui: ChangelogVersion['ui'] }): any
  date(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  image(props: { ui: ChangelogVersion['ui'] }): any
  body(props?: {}): any
  footer(props?: {}): any
  authors(props?: {}): any
  actions(props?: {}): any
  indicator(props: { ui: ChangelogVersion['ui'] }): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, useDateFormatter } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import ImageComponent from '#build/ui-image-component'
import { useLocale, useAppConfig } from '#imports'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import UBadge from './Badge.vue'
import UUser from './User.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ChangelogVersionProps>(), {
  as: 'article',
  indicator: true
})
const slots = defineSlots<ChangelogVersionSlots>()

const { locale } = useLocale()
const appConfig = useAppConfig() as ChangelogVersion['AppConfig']
const formatter = useDateFormatter(locale.value.code)

const [DefineLinkTemplate, ReuseLinkTemplate] = createReusableTemplate()
const [DefineDateTemplate, ReuseDateTemplate] = createReusableTemplate<{ hidden?: boolean }>({
  props: {
    hidden: {
      type: Boolean,
      default: false
    }
  }
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.changelogVersion || {}) })({
  to: !!props.to || !!props.onClick
}))

const date = computed(() => {
  if (!props.date) {
    return
  }

  try {
    return formatter.custom(new Date(props.date), { dateStyle: 'medium' })
  } catch {
    return props.date
  }
})
const datetime = computed(() => {
  if (!props.date) {
    return
  }

  try {
    return new Date(props.date)?.toISOString()
  } catch {
    return undefined
  }
})
const ariaLabel = computed(() => {
  const slotText = slots.title && getSlotChildrenText(slots.title())
  return (slotText || props.title || 'Version link').trim()
})
</script>

<template>
  <DefineLinkTemplate>
    <ULink
      v-if="to"
      :aria-label="ariaLabel"
      v-bind="{ to, target, ...$attrs }"
      class="focus:outline-none peer"
      tabindex="-1"
      raw
    >
      <span class="absolute inset-0" aria-hidden="true" />
    </ULink>
  </DefineLinkTemplate>

  <DefineDateTemplate v-slot="{ hidden }">
    <time v-if="date" :datetime="datetime" data-slot="date" :class="ui.date({ class: props.ui?.date, hidden })">
      <slot name="date">
        {{ date }}
      </slot>
    </time>
  </DefineDateTemplate>

  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })" @click="onClick">
    <div v-if="!!props.indicator || !!slots.indicator" data-slot="indicator" :class="ui.indicator({ class: props.ui?.indicator })">
      <slot name="indicator" :ui="ui">
        <ReuseDateTemplate />

        <div data-slot="dot" :class="ui.dot({ class: props.ui?.dot })">
          <div data-slot="dotInner" :class="ui.dotInner({ class: props.ui?.dotInner })" />
        </div>
      </slot>
    </div>

    <div data-slot="container" :class="ui.container({ class: props.ui?.container })">
      <div v-if="!!slots.header || (date || !!slots.date) || (badge || !!slots.badge) || (title || !!slots.title) || (description || !!slots.description) || (image || !!slots.image)" data-slot="header" :class="ui.header({ class: props.ui?.header })">
        <slot name="header">
          <div v-if="(date || !!slots.date) || (badge || !!slots.badge)" data-slot="meta" :class="ui.meta({ class: props.ui?.meta, badge: (!!badge || !!slots.badge) || !props.indicator })">
            <slot name="badge" :ui="ui">
              <UBadge
                v-if="badge"
                color="neutral"
                variant="solid"
                v-bind="typeof badge === 'string' ? { label: badge } : badge"
                data-slot="badge"
                :class="ui.badge({ class: props.ui?.badge })"
              />
            </slot>

            <ReuseDateTemplate :hidden="!!props.indicator" />
          </div>

          <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: props.ui?.title })">
            <ReuseLinkTemplate />

            <slot name="title">
              {{ title }}
            </slot>
          </h2>

          <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: props.ui?.description })">
            <slot name="description">
              {{ description }}
            </slot>
          </div>

          <div v-if="image || !!slots.image" data-slot="imageWrapper" :class="ui.imageWrapper({ class: props.ui?.imageWrapper })">
            <slot name="image" :ui="ui">
              <component
                :is="ImageComponent"
                v-if="image"
                v-bind="typeof image === 'string' ? { src: image, alt: title } : { alt: title, ...image }"
                data-slot="image"
                :class="ui.image({ class: props.ui?.image, to: !!to })"
              />
            </slot>

            <ReuseLinkTemplate />
          </div>
        </slot>
      </div>

      <slot name="body" />

      <div v-if="!!slots.footer || (authors?.length || !!slots.authors) || !!slots.actions" data-slot="footer" :class="ui.footer({ class: props.ui?.footer, body: !!slots.body })">
        <slot name="footer">
          <div v-if="authors?.length || !!slots.authors" data-slot="authors" :class="ui.authors({ class: props.ui?.authors })">
            <slot name="authors">
              <UUser
                v-for="(author, index) in authors"
                :key="index"
                v-bind="author"
              />
            </slot>
          </div>

          <slot name="actions" />
        </slot>
      </div>
    </div>
  </Primitive>
</template>
