<script setup lang="ts">
const appConfig = useAppConfig()

const { data: page } = await useAsyncData('showcase', () => queryCollection('showcase').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

/** The site behind a project, as its second line. */
function hostname(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    title: page.value.title,
    description: page.value.description
  })
}
</script>

<template>
  <UMain v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer>
      <UPage>
        <UPageBody class="space-y-0">
          <PageSectionHeading title="Selected projects">
            <UButton
              to="https://github.com/nuxt/ui/edit/v4/docs/content/showcase.yml"
              target="_blank"
              color="neutral"
              variant="outline"
              size="sm"
              :trailing-icon="appConfig.ui.icons.plus"
            >
              Submit yours
            </UButton>
          </PageSectionHeading>

          <UPageGrid class="lg:grid-cols-4 gap-x-4 gap-y-6">
            <UPageCard
              v-for="item in page.items"
              :key="item.name"
              :to="item.url"
              target="_blank"
              :title="item.name"
              :description="hostname(item.url)"
              variant="outline"
              class="group overflow-hidden"
              :ui="{
                container: 'p-0 sm:p-0',
                wrapper: 'items-stretch',
                header: 'mb-0 border-b border-default overflow-hidden bg-muted/40',
                body: 'p-3 text-center',
                title: 'text-sm',
                description: 'text-sm'
              }"
            >
              <template #header>
                <NuxtImg
                  :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
                  :alt="`Screenshot of ${item.name}`"
                  width="327"
                  height="184"
                  :modifiers="{ position: 'top' }"
                  loading="lazy"
                  class="aspect-video w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
                />
              </template>
            </UPageCard>
          </UPageGrid>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
