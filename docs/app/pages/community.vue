<script setup lang="ts">
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
  <main v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer class="pt-12 sm:pt-14 pb-16">
      <PageSectionHeading title="Projects and integrations">
        <ULink
          to="https://github.com/nuxt/ui/edit/v4/docs/content/community.yml"
          target="_blank"
          class="text-xs text-muted hover:text-highlighted transition-colors whitespace-nowrap"
        >
          Submit yours
        </ULink>
      </PageSectionHeading>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="item in page.items"
          :key="item.label"
          :to="item.to"
          target="_blank"
          class="group flex flex-col gap-3 rounded-xl border border-default p-5 hover:border-accented hover:bg-elevated/40 transition-colors focus-visible:outline-primary"
        >
          <UAvatar
            v-bind="item.avatar"
            :alt="`${item.label} logo`"
            size="lg"
            loading="lazy"
            class="rounded-xl bg-elevated"
          />

          <span class="font-semibold tracking-tight text-highlighted">{{ item.label }}</span>

          <p class="text-sm leading-relaxed text-muted text-pretty">
            {{ item.description }}
          </p>

          <span v-if="item.user" class="mt-auto self-start flex items-center gap-2 rounded-full border border-default ps-1 pe-3 py-1">
            <UAvatar
              v-bind="item.user.avatar"
              :alt="`${item.user.name} avatar`"
              size="2xs"
              loading="lazy"
            />
            <span class="text-xs font-medium text-toned">{{ item.user.name }}</span>
          </span>
        </NuxtLink>
      </div>
    </UContainer>
  </main>
</template>
