<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { MarkdownDocument } from '@comark/vue'
import { parseMarkdown } from '../../../utils/markdown'
import type { MarkdownDoc } from '../../../utils/markdown'

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
// A tag no version answers to is a 404. An empty list is GitHub being
// unreachable, which the page says instead of erroring.
if (!release && releases.value.length) {
  throw createError({ statusCode: 404, statusMessage: 'Release not found', fatal: true })
}

// The route serves the notes as Markdown, the page turns them into the tree it
// renders and the headings its table of contents needs. Parsed once into the
// payload, which flattens the document's node union, so it is read back as the
// parser wrote it.
const { data: ast } = await useAsyncData(`release-${release?.tag ?? 'unavailable'}`, async () => {
  if (!release) {
    return null
  }

  const { markdown } = await $fetch(`/api/github/releases/${release.tag}`)

  return await parseMarkdown(markdown)
})
const notes = computed(() => ast.value as MarkdownDoc | null)

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const { findBreadcrumb } = useNavigation(navigation!)

const breadcrumb = computed(() => findBreadcrumb('/docs/releases'))

// Formatted in UTC, the timezone GitHub publishes in: a local one would move a
// release published late in the day to another date for readers east of UTC.
const formatDate = (value: string) => new Date(value).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
const date = release ? formatDate(release.date) : ''

// Newer on the left, older on the right, the order the section nav lists them in.
const surround = release
  ? [releases.value[index - 1], releases.value[index + 1]].map(entry => entry && {
      title: entry.title,
      path: releasePath(releases.value, entry.tag),
      description: formatDate(entry.date)
    })
  : []

// Without a release the header carries the section's own copy.
const title = release?.title ?? page.value.title
const description = release ? `Released on ${date}` : page.value.description

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: release ? `${title} - Releases` : title,
  description: page.value.description,
  ogTitle: release ? `${title} - Releases - Nuxt UI` : `${title} - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title,
    description,
    headline: 'Releases'
  })
}
</script>

<template>
  <UPage>
    <UPageHeader
      :title="title"
      :description="description"
      :links="[{
        label: 'View on GitHub',
        icon: 'i-simple-icons-github',
        to: release?.url ?? 'https://github.com/nuxt/ui/releases',
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
      <!-- the document arrives parsed, so it renders rather than DocsMarkdown, which takes markdown -->
      <MarkdownDocument v-if="notes" :value="notes" />

      <!-- an empty list or notes that would not load: the same dead end -->
      <p v-else class="text-muted">
        Release notes are unavailable right now, see them on
        <ULink to="https://github.com/nuxt/ui/releases" target="_blank" class="text-primary font-medium">GitHub</ULink>.
      </p>

      <template v-if="release">
        <USeparator v-if="surround.some(Boolean)" />

        <UContentSurround :surround="(surround as any)" />
      </template>
    </UPageBody>

    <template v-if="notes?.meta?.toc?.links?.length" #right>
      <UContentToc :links="notes.meta.toc.links" class="z-2" highlight highlight-variant="circuit" />
    </template>
  </UPage>
</template>
