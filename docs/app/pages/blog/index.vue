<script setup lang="ts">
const appConfig = useAppConfig()

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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <main v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer class="max-w-[1180px] pt-8 pb-16">
      <ULink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-7 py-6 px-3 border-b border-default hover:bg-elevated/40 transition-colors"
      >
        <span class="w-24 shrink-0 font-mono text-xs text-muted">{{ formatDate(post.date) }}</span>

        <span class="flex flex-col gap-1 min-w-0">
          <span class="text-[17px] font-semibold tracking-tight text-highlighted group-hover:text-primary transition-colors">{{ post.title }}</span>
          <span class="text-sm leading-relaxed text-muted text-pretty line-clamp-2">{{ post.description }}</span>
        </span>

        <span class="sm:ms-auto flex items-center gap-3 shrink-0">
          <UAvatarGroup v-if="post.authors?.length" size="sm">
            <UAvatar
              v-for="author in post.authors.slice(0, 3)"
              :key="author.name"
              :src="author.avatar?.src"
              :alt="`${author.name} avatar`"
            />
          </UAvatarGroup>

          <UIcon :name="appConfig.ui.icons.chevronRight" class="size-4 text-dimmed group-hover:text-highlighted transition-colors" />
        </span>
      </ULink>
    </UContainer>
  </main>
</template>
