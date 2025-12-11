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
        <time class="text-muted font-normal">{{ new Date(page.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <template #title>
        <UButton icon="i-lucide-arrow-left" to="/blog" color="neutral" variant="soft" class="absolute -left-10 rounded-full" />

        {{ page.title }}
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
    </UPageBody>

    <template #right>
      <nav class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] hidden lg:flex flex-col">
        <ProseCodeTree :model-value="activePath" class="lg:h-auto flex-1 my-0 rounded-none border-y-0" :items="items" />
      </nav>
    </template>
  </UPage>
</template>
