<script setup lang="ts">
const { data: versions } = await useFetch('https://ungh.cc/repos/nuxt/ui/releases', {
  transform: (data: {
    releases: {
      name?: string
      tag: string
      publishedAt: string
      markdown: string
    }[]
  }) => {
    return data.releases.map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt,
      markdown: release.markdown
    }))
  }
})
</script>

<template>
  <div class="relative">
    <UPageHero
      title="Releases"
      description="Stay up to date with the newest features, enhancements, and fixes for Nuxt UI."
      class="md:border-b border-default"
      :ui="{
        container: 'relative'
      }"
    >
      <LazyStarsBg />

      <div aria-hidden="true" class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection
      :ui="{
        container: '!py-0'
      }"
    >
      <div class="py-4 md:py-8 lg:py-16 md:border-x border-default">
        <UContainer class="max-w-5xl">
          <UChangelogVersions>
            <UChangelogVersion
              v-for="version in versions"
              :key="version.tag"
              v-bind="version"
              :ui="{
                root: 'flex items-start',
                container: 'max-w-xl',
                header: 'border-b border-default pb-4',
                title: 'text-3xl',
                date: 'text-xs/9 text-highlighted font-mono',
                indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
              }"
            >
              <template #body>
                <MDC
                  v-if="version.markdown"
                  :value="version.markdown"
                />
              </template>
            </UChangelogVersion>
          </UChangelogVersions>
        </UContainer>
      </div>
    </UPageSection>
  </div>
</template>
