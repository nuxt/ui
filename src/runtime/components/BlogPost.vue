<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/blog-post'
import type { BadgeProps, LinkProps, UserProps } from '../types'
import type { ImgHTMLAttributes } from '../types/html'
import type { ComponentConfig } from '../types/tv'

type BlogPost = ComponentConfig<typeof theme, AppConfig, 'blogPost'>

export interface BlogPostProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'article'
   */
  as?: any
  title?: string
  description?: string
  /** The date of the blog post. Can be a string or a Date object. */
  date?: string | Date
  /**
   * Display a badge on the blog post.
   * Can be a string or an object.
   * `{ color: 'neutral', variant: 'subtle' }`{lang="ts-type"}
   */
  badge?: string | BadgeProps
  /** The authors of the blog post. */
  authors?: UserProps[]
  /** The image of the blog post. Can be a string or an object. */
  image?: string | (Partial<ImgHTMLAttributes> & { [key: string]: any })
  /**
   * The orientation of the blog post.
   * @defaultValue 'vertical'
   */
  orientation?: BlogPost['variants']['orientation']
  /**
   * @defaultValue 'outline'
   */
  variant?: BlogPost['variants']['variant']
  to?: LinkProps['to']
  target?: LinkProps['target']
  onClick?: (event: MouseEvent) => void | Promise<void>
  class?: any
  ui?: BlogPost['slots']
}

export interface BlogPostSlots {
  date(props?: {}): any
  badge(props?: {}): any
  title(props?: {}): any
  description(props?: {}): any
  authors(props: { ui: BlogPost['ui'] }): any
  header(props: { ui: BlogPost['ui'] }): any
  body(props?: {}): any
  footer(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive, useDateFormatter } from 'reka-ui'
import { useLocale, useAppConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { useComponentUI } from '../composables/useComponentUI'
import { getSlotChildrenText } from '../utils'
import { tv } from '../utils/tv'
import ULink from './Link.vue'
import UBadge from './Badge.vue'
import UAvatar from './Avatar.vue'
import UAvatarGroup from './AvatarGroup.vue'
import UUser from './User.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<BlogPostProps>(), {
  as: 'article',
  orientation: 'vertical'
})
const slots = defineSlots<BlogPostSlots>()

const { locale } = useLocale()
const appConfig = useAppConfig() as BlogPost['AppConfig']
const uiProp = useComponentUI('blogPost', props)
const formatter = useDateFormatter(locale.value.code)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.blogPost || {}) })({
  orientation: props.orientation,
  variant: props.variant,
  image: !!props.image,
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
  return (slotText || props.title || 'Post link').trim()
})
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })" @click="onClick">
    <div v-if="image || !!slots.header" data-slot="header" :class="ui.header({ class: uiProp?.header })">
      <slot name="header" :ui="ui">
        <component
          :is="ImageComponent"
          v-bind="typeof image === 'string' ? { src: image, alt: title } : { alt: title, ...image }"
          data-slot="image"
          :class="ui.image({ class: uiProp?.image, to: !!to })"
        />
      </slot>
    </div>

    <div data-slot="body" :class="ui.body({ class: uiProp?.body })">
      <ULink
        v-if="to"
        :aria-label="ariaLabel"
        v-bind="{ to, target, ...$attrs }"
        class="focus:outline-none peer"
        raw
      >
        <span class="absolute inset-0" aria-hidden="true" />
      </ULink>

      <slot name="body">
        <div v-if="(date || !!slots.date) || (badge || !!slots.badge)" data-slot="meta" :class="ui.meta({ class: uiProp?.meta })">
          <slot name="badge">
            <UBadge
              v-if="badge"
              color="neutral"
              variant="subtle"
              v-bind="typeof badge === 'string' ? { label: badge } : badge"
              data-slot="badge"
              :class="ui.badge({ class: uiProp?.badge })"
            />
          </slot>

          <time v-if="date || !!slots.date" :datetime="datetime" data-slot="date" :class="ui.date({ class: uiProp?.date })">
            <slot name="date">
              {{ date }}
            </slot>
          </time>
        </div>

        <h2 v-if="title || !!slots.title" data-slot="title" :class="ui.title({ class: uiProp?.title })">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>

        <div v-if="description || !!slots.description" data-slot="description" :class="ui.description({ class: uiProp?.description })">
          <slot name="description">
            {{ description }}
          </slot>
        </div>

        <div v-if="authors?.length || !!slots.authors" data-slot="authors" :class="ui.authors({ class: uiProp?.authors })">
          <slot name="authors" :ui="ui">
            <template v-if="authors?.length">
              <UAvatarGroup v-if="authors.length > 1">
                <ULink
                  v-for="(author, index) in authors"
                  :key="index"
                  :to="author.to"
                  :target="author.target"
                  data-slot="avatar"
                  :class="ui.avatar({ class: uiProp?.avatar, to: !!author.to })"
                  raw
                >
                  <UAvatar v-bind="author.avatar" />
                </ULink>
              </UAvatarGroup>
              <UUser v-else v-bind="authors[0]" />
            </template>
          </slot>
        </div>
      </slot>
    </div>

    <div v-if="!!slots.footer" data-slot="footer" :class="ui.footer({ class: uiProp?.footer })">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
