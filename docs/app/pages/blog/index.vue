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

defineOgImageComponent('Docs')

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <main v-if="page" class="relative flex flex-col min-h-[calc(100vh-150px)]">
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <LazyStarsBg />

      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="blog-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.hero.description" unwrap="p" cache-key="blog-hero-description" />
      </template>
    </UPageHero>

    <UPageBody class="my-0! py-0! border-y border-default">
      <UContainer>
        <div class="border-x border-default gap-0!">
          <Motion
            v-for="(post, index) in posts"
            :key="post.path"
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 30 }"
            class="group border-b border-default last:border-b-0"
          >
            <ULink
              :to="post.path"
              class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-muted/30 transition-all duration-200 gap-4 sm:gap-6"
            >
              <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 flex-1 min-w-0">
                <div class="flex-1 min-w-0">
                  <div class="text-xs text-muted font-mono shrink-0 mb-1">
                    {{ formatDate(post.date) }}
                  </div>

                  <h2 class="font-medium text-highlighted group-hover:text-primary transition-colors duration-200 truncate sm:text-base">
                    {{ post.title }}
                  </h2>
                  <p class="text-sm text-muted mt-1 line-clamp-2 sm:line-clamp-1">
                    {{ post.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-3 sm:gap-2 shrink-0">

                <UAvatarGroup v-if="post.authors?.length" size="sm" class="sm:size-sm">
                  <UAvatar
                    v-for="author in post.authors.slice(0, 3)"
                    :key="author.name"
                    :src="author.avatar?.src"
                    :alt="author.name"
                    size="sm"
                  />
                </UAvatarGroup>

                <UIcon
                  name="i-lucide-chevron-right"
                  class="size-4 text-muted group-hover:text-highlighted transition-colors duration-200 shrink-0"
                />
              </div>
            </ULink>
          </Motion>
        </div>
      </UContainer>
    </UPageBody>

    <UContainer class="relative min-h-24 grow">
      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UContainer>
  </main>
</template>
