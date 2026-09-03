<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

/**
 * One release per page, the docs frame with GitHub releases as pages: the
 * versions are the section nav (loaded by the `releases` middleware so the
 * layout's aside has them at render) and the notes' headings the table of
 * contents. /docs/releases is the latest, older ones live under their tag.
 * The content stub at 5.releases/1.index.md gives the section its tab and copy.
 */
definePageMeta({
  layout: 'docs',
  middleware: 'releases'
})

const route = useRoute()

const { data: page } = await useAsyncData('docs-releases', () => queryCollection('docs').path('/docs/releases').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const releases = useReleases()

const index = route.params.tag ? releases.value.findIndex(entry => entry.tag === route.params.tag) : 0
const release = releases.value[index]
if (!release) {
  throw createError({ statusCode: 404, statusMessage: 'Release not found', fatal: true })
}

// Only this release's parsed tree rides the payload, with the headings the
// table of contents needs (the MDC component's partial parse has none).
const { data: ast } = await useAsyncData(`release-${release.tag}`, async () => {
  const notes = (await fetchReleases()).find(entry => entry.tag === release.tag)?.markdown ?? ''

  return parseMarkdown(notes, { toc: { depth: 3, searchDepth: 3 } })
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { findBreadcrumb } = useNavigation(navigation!)

const breadcrumb = computed(() => findBreadcrumb('/docs/releases'))

const formatDate = (value: string) => new Date(value).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' })
const date = formatDate(release.date)

// Newer on the left, older on the right, the order the section nav lists them in.
const surround = [releases.value[index - 1], releases.value[index + 1]].map(entry => entry && {
  title: entry.title,
  path: releasePath(releases.value, entry.tag),
  description: formatDate(entry.date)
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: `${release.title} - Releases`,
  description: page.value.description,
  ogTitle: `${release.title} - Releases - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title: release.title,
    description: `Released on ${date}`,
    headline: 'Releases'
  })
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="release.title"
      :description="`Released on ${date}`"
      :links="[{
        label: 'View on GitHub',
        icon: 'i-simple-icons-github',
        to: `https://github.com/nuxt/ui/releases/tag/${release.tag}`,
        target: '_blank',
        color: 'neutral',
        variant: 'outline'
      }]"
    >
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>
    </UPageHeader>

    <UPageBody>
      <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />

      <USeparator v-if="surround.some(Boolean)" />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="ast?.toc?.links?.length" #right>
      <UContentToc :links="ast.toc.links" class="z-2" highlight highlight-variant="circuit" />
    </template>
  </UPage>
</template>
