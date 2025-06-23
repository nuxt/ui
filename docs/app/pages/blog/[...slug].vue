<script setup lang="ts">
import { kebabCase } from 'scule'

const route = useRoute()

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection('blog').path(route.path).first()),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings('blog', route.path, {
      fields: ['description']
    }).order('date', 'DESC')
  })
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

if (page.value.image) {
  defineOgImage({ url: page.value.image })
} else {
  defineOgImageComponent('Docs', {
    headline: 'Blog',
    title,
    description
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).toUpperCase()
}

const getCategoryVariant = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'release': return 'solid'
    case 'tutorial': return 'soft'
    case 'improvement': return 'soft'
    default: return 'soft'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'release': return 'i-lucide-rocket'
    case 'tutorial': return 'i-lucide-book-open'
    case 'improvement': return 'i-lucide-trending-up'
    default: return 'i-lucide-file-text'
  }
}
</script>

<template>
  <div v-if="page" class="min-h-screen">
    <div class="border-b border-default">
      <UContainer class="py-4">
        <ULink to="/blog" class="flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-chevron-left" class="size-4" />
          Back to Blog
        </ULink>
      </UContainer>
    </div>

    <div class="py-16 sm:pt-20 pb-10">
      <UContainer class="max-w-4xl">
        <div class="text-center space-y-6">
          <div class="flex items-center justify-center gap-4 text-sm">
            <UBadge
              v-if="page.category"
              :variant="getCategoryVariant(page.category)"
              size="sm"
              class="font-mono text-xs gap-2"
            >
              <UIcon :name="getCategoryIcon(page.category)" class="size-3" />
              {{ page.category?.toUpperCase() }}
            </UBadge>

            <span class="text-muted font-mono text-xs">
              {{ formatDate(page.date) }}
            </span>

            <span v-if="page.minRead" class="text-muted font-mono text-xs">
              {{ page.minRead }} MIN READ
            </span>
          </div>

          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-highlighted leading-tight">
              {{ page.title }}
            </h1>
          </Motion>

          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.1, duration: 0.6 }"
          >
            <p class="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              {{ page.description }}
            </p>
          </Motion>

          <Motion
            v-if="page.authors?.length"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.2, duration: 0.6 }"
            class="flex justify-center"
          >
            <UAvatarGroup>
              <ULink
                v-for="(author, index) in page.authors"
                :key="index"
                :to="author.to"
                raw
              >
                <UAvatar v-bind="author.avatar" />
              </ULink>
            </UAvatarGroup>
          </Motion>
        </div>
      </UContainer>
    </div>

    <div v-if="page.image" class="py-4">
      <UContainer class="max-w-6xl">
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.3, duration: 0.8 }"
        >
          <NuxtImg
            :src="page.image"
            :alt="page.title"
            class="w-full max-h-[400px] object-cover object-center max-w-5xl mx-auto"
          />
        </Motion>
      </UContainer>
    </div>

    <div class="py-12 sm:py-16">
      <UContainer class="max-w-3xl">
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4, duration: 0.6 }"
        >
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />
        </Motion>

        <div v-if="surround?.length" class="mt-16 pt-8 border-t border-default">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.6, duration: 0.6 }"
          >
            <UContentSurround :surround="surround" />
          </Motion>
        </div>
      </UContainer>
    </div>
  </div>
</template>
