<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  layout: 'blog'
})

const route = useRoute()

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('blog').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const tree = ref<Record<string, Node>>({})

provide('tree', tree)

const items = computed(() => Object.entries(tree.value).map(([key, value]) => ({ label: key, component: value })))
const modelValue = computed(() => Object.keys(tree.value)[Object.keys(tree.value).length - 1])
</script>

<template>
  <UPage v-if="page" :ui="{ center: 'lg:col-span-5', right: 'lg:col-span-5' }">
    <UPageHeader :title="page.title">
      <template #headline />

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" :cache-key="`${kebabCase(route.path)}-description`" />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
    </UPageBody>

    <template v-if="page.intersection" #right>
      <nav class="sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] flex flex-col">
        <ProseCodeTree :model-value="modelValue" class="my-8 lg:h-auto flex-1" :items="items" />
      </nav>
    </template>
  </UPage>
</template>
