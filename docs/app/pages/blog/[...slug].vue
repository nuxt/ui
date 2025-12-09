<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)

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
  <UContainer v-if="page" class="relative min-h-screen">
    <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

    <div class="border-b border-default">
      <div class="py-4 px-4 sm:px-6 lg:px-8">
        <ULink to="/blog" class="flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-chevron-left" class="size-4" />
          Back to Blog
        </ULink>
      </div>
    </div>

    <div class="py-16 sm:pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center space-y-6">
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
    </div>

    <div v-if="page.image" class="py-4 px-4 sm:px-6 lg:px-8">
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
    </div>

    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
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

        <div v-if="surround?.length" class="mt-16 pt-8">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.6, duration: 0.6 }"
          >
            <UContentSurround :surround="surround" />
          </Motion>
        </div>
      </div>
    </div>
  </UContainer>
</template>
