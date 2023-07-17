<template>
  <UDocsPage v-if="page" :page="page" :surround="(surround as ParsedContent[])">
    <template #footer>
      <Footer />
    </template>
  </UDocsPage>
  <div v-else class="pt-8">
    Page not found
  </div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne())
const { data: surround } = await useAsyncData(`docs-${route.path}-surround`, () => queryContent()
  .only(['_path', 'title', 'navigation', 'description'])
  .where({ _extension: 'md', navigation: { $ne: false } })
  .findSurround(route.path.endsWith('/') ? route.path.slice(0, -1) : route.path)
)

if (process.server && !page.value) {
  const event = useRequestEvent()
  setResponseStatus(event, 404)
}

useContentHead(page)
</script>
