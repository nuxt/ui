<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  layout: 'blog'
})

const route = useRoute()

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('posts').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const tree = ref<Record<string, Node>>({})
const activePath = ref()

provide('tree', tree)
provide('activePath', activePath)

const items = computed(() => Object.entries(tree.value).map(([key, value]) => ({ label: key, component: value })))
</script>

<template>
  <UPage v-if="page" :ui="{ center: 'lg:col-span-5', right: 'lg:col-span-5' }" class="lg:gap-16">
    <UPageHeader :title="page.title" :description="page.description" :ui="{ title: 'relative flex items-center' }">
      <template #headline>
        <UButton
          icon="i-lucide-arrow-left"
          label="Back to blog"
          to="/blog"
          variant="link"
          class="p-0"
          :ui="{ leadingIcon: 'size-4' }"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted font-normal">{{ new Date(page.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div v-if="page.authors?.length" class="flex items-center gap-6 mt-6">
        <template v-for="author in page.authors" :key="author.name">
          <ULink v-if="author.to" :to="author.to" target="_blank" class="flex items-center gap-3 group">
            <UAvatar :src="author.avatar?.src" :alt="author.name" size="lg" />
            <div class="flex flex-col">
              <span class="text-sm font-medium text-highlighted">{{ author.name }}</span>
              <span class="text-xs text-muted group-hover:text-primary transition-colors">@{{ author.to.split('/').pop() }}</span>
            </div>
          </ULink>
          <div v-else class="flex items-center gap-3">
            <UAvatar :src="author.avatar?.src" :alt="author.name" size="lg" />
            <span class="text-sm font-medium text-highlighted">{{ author.name }}</span>
          </div>
        </template>
      </div>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
    </UPageBody>

    <template #right>
      <nav class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] hidden lg:block">
        <ProseCodeTree :model-value="activePath" class="lg:h-full my-0 rounded-none border-y-0" :items="items" />
      </nav>
    </template>
  </UPage>
</template>
