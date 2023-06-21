<template>
  <div v-if="page" class="grid lg:grid-cols-10 lg:gap-8">
    <div class="pt-8 pb-16" :class="page.body?.toc ? 'lg:col-span-8' : 'lg:col-span-10'">
      <DocsPageHeader :page="page" />

      <ContentRenderer v-if="page.body" :value="page" class="prose prose-primary dark:prose-invert max-w-none" />

      <DocsPageFooter :page="page" class="mt-12" />

      <hr class="border-gray-200 dark:border-gray-800 my-6">

      <DocsPrevNext :prev="prev" :next="next" />

      <DocsFooter class="mt-16" />
    </div>

    <DocsToc v-if="page.body?.toc" :toc="page.body.toc" class="lg:col-span-2" />
  </div>
  <div v-else class="flex-1 flex flex-col items-center justify-center">
    <div class="text-center">
      <p class="text-base font-semibold text-primary-500 dark:text-primary-400">
        404
      </p>
      <h1 class="mt-2 text-4xl tracking-tight font-extrabold u-text-gray-900 sm:text-5xl">
        Page not found
      </h1>
      <p class="mt-2 text-base u-text-gray-500">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div class="mt-6">
        <NuxtLink to="/" class="text-base font-medium text-primary-500 dark:text-primary-400 hover:u-text-gray-900">
          Go back home
          <span aria-hidden="true"> &rarr;</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne())
const { data: surround } = await useAsyncData(`docs-${route.path}-surround`, () => queryContent()
  .only(['_path', 'title', 'navigation', 'description'])
  .where({ _extension: 'md', navigation: { $ne: false } })
  .findSurround(route.path.endsWith('/') ? route.path.slice(0, -1) : route.path)
)

const [prev, next] = surround.value

useContentHead(page)
</script>
