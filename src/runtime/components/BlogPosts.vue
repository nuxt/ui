<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/blog-posts'
import type { BlogPostProps } from '../types'
import type { ComponentConfig } from '../types/tv'

type BlogPosts = ComponentConfig<typeof theme, AppConfig, 'blogPosts'>

export interface BlogPostsProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  posts?: BlogPostProps[]
  /**
   * The orientation of the blog posts.
   * @defaultValue 'horizontal'
   */
  orientation?: BlogPosts['variants']['orientation']
  class?: any
}

export interface BlogPostsSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { tv } from '../utils/tv'
import UBlogPost from './BlogPost.vue'

const props = withDefaults(defineProps<BlogPostsProps>(), {
  orientation: 'horizontal'
})
defineSlots<BlogPostsSlots>()

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
      />
    </slot>
  </Primitive>
</template>
