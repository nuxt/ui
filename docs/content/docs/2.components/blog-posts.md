---
title: BlogPosts
description: 'Display a list of blog posts in a responsive grid layout.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/BlogPosts.vue
---

## Usage

The BlogPosts component provides a flexible layout to display a list of [BlogPost](/docs/components/blog-post) components using either the default slot or the `posts` prop.

```vue {2,8}
<template>
  <UBlogPosts>
    <UBlogPost
      v-for="(post, index) in posts"
      :key="index"
      v-bind="post"
    />
  </UBlogPosts>
</template>
```

### Posts

Use the `posts` prop as an array of objects with the properties of the [BlogPost](/docs/components/blog-post#props) component.

::component-code
---
collapse: true
ignore:
  - posts
external:
  - posts
externalTypes:
  - BlogPostProps[]
props:
  posts:
    - title: Nuxt Icon v1
      description: 'Discover Nuxt Icon v1!'
      image: https://nuxt.com/assets/blog/nuxt-icon/cover.png
      date: 2024-11-25
    - title: Nuxt 3.14
      description: 'Nuxt 3.14 is out!'
      image: https://nuxt.com/assets/blog/v3.14.png
      date: 2024-11-04
    - title: Nuxt 3.13
      description: 'Nuxt 3.13 is out!'
      image: https://nuxt.com/assets/blog/v3.13.png
      date: 2024-08-22
---
::

### Orientation

Use the `orientation` prop to change the orientation of the BlogPosts. Defaults to `horizontal`.

::component-code
---
collapse: true
ignore:
  - posts
external:
  - posts
externalTypes:
  - BlogPostProps[]
props:
  orientation: vertical
  posts:
    - title: Nuxt Icon v1
      description: 'Discover Nuxt Icon v1!'
      image: https://nuxt.com/assets/blog/nuxt-icon/cover.png
      date: 2024-11-25
    - title: Nuxt 3.14
      description: 'Nuxt 3.14 is out!'
      image: https://nuxt.com/assets/blog/v3.14.png
      date: 2024-11-04
    - title: Nuxt 3.13
      description: 'Nuxt 3.13 is out!'
      image: https://nuxt.com/assets/blog/v3.13.png
      date: 2024-08-22
---
::

::tip
When using the `posts` prop instead of the default slot, the `orientation` of the posts is automatically reversed, `horizontal` to `vertical` and vice versa.
::

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a page

Use the BlogPosts component in a page to create a blog page:

```vue [pages/blog/index.vue]{11-18}
<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('posts').all())
</script>

<template>
  <UPage>
    <UPageHero title="Blog" />

    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
```

::note
In this example, the `posts` are fetched using `queryCollection` from the `@nuxt/content` module.
::

::tip
The `to` prop is overridden here since `@nuxt/content` uses the `path` property.
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
