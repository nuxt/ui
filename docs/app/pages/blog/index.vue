<script setup lang="ts">
const { data: page } = await useAsyncData('blog', () =>
  queryCollection('blog').first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryCollection('posts').order('date', 'DESC').all()
)

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title: page.value.title,
    description: page.value.description
  })
}
</script>

<template>
  <UMain v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer>
      <UPage>
        <UPageBody class="space-y-0">
          <PageSectionHeading title="Latest posts" :meta="`${posts?.length ?? 0} ${posts?.length === 1 ? 'post' : 'posts'}`" />

          <UBlogPosts orientation="vertical">
            <UBlogPost
              v-for="post in posts"
              :key="post.path"
              :to="post.path"
              :title="post.title"
              :description="post.description"
              :image="post.image"
              :date="post.date"
              :badge="post.category"
              :authors="post.authors?.map(author => ({ ...author, target: '_blank' }))"
              orientation="horizontal"
              variant="naked"
              :ui="{ root: 'lg:grid-cols-[auto_1fr] lg:gap-x-9', header: 'lg:w-110 rounded-md border border-default shadow-none' }"
            />
          </UBlogPosts>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
