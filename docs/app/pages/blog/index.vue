<script setup lang="ts">
const { data: page } = await useAsyncData('blog-index', () =>
  queryCollection('blogIndex').first()
)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: posts } = await useAsyncData('blogs', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

const selectedFilter = ref('all')
const searchQuery = ref('')

const availableFilters = computed(() => {
  if (!posts.value?.length) return [{ key: 'all', label: 'ALL', count: 0 }]

  const postsData = posts.value
  const categories = new Set(postsData.map(post => post.category?.toLowerCase()).filter(Boolean))

  const filters = [
    { key: 'all', label: 'ALL', count: postsData.length }
  ]

  categories.forEach((category) => {
    const count = postsData.filter(p => p.category?.toLowerCase() === category).length
    const label = category.replace(/\b\w/g, l => l.toUpperCase()).replace(/([a-z])([A-Z])/g, '$1 $2')

    filters.push({
      key: category,
      label: label,
      count
    })
  })

  return filters.sort((a, b) => {
    if (a.key === 'all') return -1
    if (b.key === 'all') return 1
    return b.count - a.count
  })
})

const filteredPosts = computed(() => {
  if (!posts.value) return []

  let filtered = posts.value

  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(post => post.category?.toLowerCase() === selectedFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post =>
      post.title?.toLowerCase().includes(query)
      || post.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit'
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
  <div v-if="page" class="relative grid grid-rows-[auto_auto_1fr] min-h-[calc(100vh-150px)]">
    <UPageHero :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }">
      <LazyStarsBg />

      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>
    </UPageHero>

    <UPageBody class="my-0! py-0! border-y border-default">
      <UContainer>
        <div class="border-x border-default px-4 sm:px-6 py-6 sm:py-8">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 sm:mb-6">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3">
              <Motion
                v-for="(filter, index) in availableFilters"
                :key="filter.key"
                :initial="{ opacity: 0, y: 10 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: index * 0.1 }"
              >
                <UButton
                  :variant="selectedFilter === filter.key ? 'solid' : 'ghost'"
                  :color="selectedFilter === filter.key ? 'primary' : 'neutral'"
                  size="sm"
                  class="font-medium transition-all duration-200 hover:scale-105 focus:scale-100 rounded-none text-xs sm:text-sm"
                  :leading-icon="selectedFilter === filter.key ? 'i-lucide-check' : 'i-lucide-circle'"
                  :label="filter.label"
                  @click="selectedFilter = filter.key"
                >
                  <template #trailing>
                    <UBadge
                      :variant="selectedFilter === filter.key ? 'solid' : 'soft'"
                      size="xs"
                    >
                      {{ filter.count }}
                    </UBadge>
                  </template>
                </UButton>
              </Motion>
            </div>

            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <div class="relative">
                <UInput
                  v-model="searchQuery"
                  placeholder="Search posts..."
                  icon="i-lucide-search"
                  class="w-full sm:w-64"
                  :ui="{
                    base: 'rounded-none'
                  }"
                />
              </div>

              <UButton
                variant="ghost"
                class="rounded-none whitespace-nowrap"
                icon="i-lucide-external-link"
                label="Follow @nuxt_js on X"
                to="https://x.com/nuxt_js"
                target="_blank"
              />
            </div>
          </div>
        </div>

        <div class="border-x border-t border-default !gap-0">
          <Motion
            v-for="(post, index) in filteredPosts"
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
                <div class="text-xs text-muted font-mono shrink-0 sm:min-w-[60px]">
                  {{ formatDate(post.date) }}
                </div>

                <UBadge
                  :variant="getCategoryVariant(post.category)"
                  size="sm"
                  class="font-mono text-xs justify-center gap-2 shrink-0 self-start sm:self-center"
                >
                  <UIcon :name="getCategoryIcon(post.category)" class="size-3" />
                  {{ post.category?.toUpperCase() || 'POST' }}
                </UBadge>

                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-highlighted group-hover:text-primary transition-colors duration-200 truncate sm:text-base">
                    {{ post.title }}
                  </h3>
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

          <Motion
            v-if="filteredPosts.length === 0"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            class="text-center py-12 sm:py-16 px-4 sm:px-6"
          >
            <UIcon name="i-lucide-search-x" class="size-10 sm:size-12 text-muted mx-auto mb-4" />
            <h3 class="text-lg font-medium mb-2">
              No posts found
            </h3>
            <p class="text-muted mb-4 text-sm sm:text-base">
              {{ searchQuery ? `No posts match "${searchQuery}"` : 'No posts in this category yet' }}
            </p>
            <UButton
              v-if="selectedFilter !== 'all' || searchQuery"
              variant="outline"
              label="Clear filters"
              class="rounded-none"
              @click="selectedFilter = 'all'; searchQuery = ''"
            />
          </Motion>
        </div>
      </UContainer>
    </UPageBody>

    <UContainer class="relative min-h-24">
      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UContainer>
  </div>
</template>
