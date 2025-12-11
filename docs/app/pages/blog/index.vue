<script setup lang="ts">
const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs')

const { data: posts } = await useAsyncData('blog-posts', () => queryCollection('posts').all())
</script>

<template>
  <UMain v-if="page" class="flex flex-col">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      class="md:border-b border-default"
      :ui="{
        container: 'relative lg:py-32'
      }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection :ui="{ container: '!py-0 flex-1' }" class="flex-1 flex flex-col">
      <div class="pb-16 sm:pb-24 lg:pb-32 md:border-x border-default">
        <UBlogPosts orientation="vertical">
          <UBlogPost
            v-for="post in posts"
            :key="post.id"
            v-bind="post"
            :to="post.path"
            class="rounded-none"
          />
        </UBlogPosts>
      </div>
    </UPageSection>
  </UMain>
</template>
