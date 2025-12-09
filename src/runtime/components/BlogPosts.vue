<!-- eslint-disable vue/block-tag-newline -->
<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/blog-posts'
import type { BlogPostProps, BlogPostSlots } from '../types'
import type { ComponentConfig } from '../types/tv'

type BlogPosts = ComponentConfig<typeof theme, AppConfig, 'blogPosts'>

export interface BlogPostsProps<T extends BlogPostProps = BlogPostProps> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  posts?: T[]
  /**
   * The orientation of the blog posts.
   * @defaultValue 'horizontal'
   */
  orientation?: BlogPosts['variants']['orientation']
  class?: any
}

type ExtendSlotWithPost<T extends BlogPostProps, K extends keyof BlogPostSlots>
  = BlogPostSlots[K] extends (props: infer P) => any
    ? (props: P & { post: T }) => any
    : BlogPostSlots[K]

export type BlogPostsSlots<T extends BlogPostProps = BlogPostProps> = {
  [K in keyof BlogPostSlots]: ExtendSlotWithPost<T, K>
} & {
  default(props?: {}): any
}

</script>

<script setup lang="ts" generic="T extends BlogPostProps">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { omit } from '../utils'
import { tv } from '../utils/tv'
import UBlogPost from './BlogPost.vue'

const props = withDefaults(defineProps<BlogPostsProps>(), {
  orientation: 'horizontal'
})
const slots = defineSlots<BlogPostsSlots<T>>()

const getProxySlots = () => omit(slots, ['default'])

const appConfig = useAppConfig() as BlogPosts['AppConfig']

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.blogPosts || {}) }))
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui({ orientation, class: props.class })">
    <slot>
      <UBlogPost
        v-for="(post, index) in posts"
        :key="index"
        :orientation="orientation === 'vertical' ? 'horizontal' : 'vertical'"
        v-bind="post"
      >
        <template v-for="(_, name) in getProxySlots()" #[name]="slotData">
          <slot :name="name" v-bind="(slotData as any)" :post="post" />
        </template>
      </UBlogPost>
    </slot>
  </Primitive>
</template>
