<script setup lang="ts">
const appConfig = useAppConfig()

const { data: page } = await useAsyncData('community', () => queryCollection('community').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
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
          <PageSectionHeading title="Projects and integrations">
            <UButton
              to="https://github.com/nuxt/ui/edit/v4/docs/content/community.yml"
              target="_blank"
              color="neutral"
              variant="outline"
              size="sm"
              :trailing-icon="appConfig.ui.icons.plus"
            >
              Submit yours
            </UButton>
          </PageSectionHeading>

          <UPageGrid class="gap-4">
            <UPageCard
              v-for="item in page.items"
              :key="item.label"
              :to="item.to"
              target="_blank"
              :title="item.label"
              :description="item.description"
              :ui="{ container: 'p-5 sm:p-5', description: 'text-sm' }"
            >
              <template #leading>
                <UAvatar
                  v-bind="item.avatar"
                  :alt="`${item.label} logo`"
                  size="lg"
                  loading="lazy"
                  class="rounded-xl bg-elevated"
                />
              </template>

              <template v-if="item.user" #footer>
                <UUser
                  :name="item.user.name"
                  :avatar="item.user.avatar"
                  size="xs"
                  class="rounded-full border border-default ps-1 pe-3 py-1"
                />
              </template>
            </UPageCard>
          </UPageGrid>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
