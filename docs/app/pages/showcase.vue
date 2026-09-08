<script setup lang="ts">
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
  <main v-if="page">
    <PageHero v-bind="page.hero" />

    <UContainer class="pt-12 sm:pt-14 pb-16">
      <PageSectionHeading title="Selected projects">
        <ULink
          to="https://github.com/nuxt/ui/edit/v4/docs/content/showcase.yml"
          target="_blank"
          class="text-xs text-muted hover:text-highlighted transition-colors whitespace-nowrap"
        >
          Submit yours
        </ULink>
      </PageSectionHeading>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
        <NuxtLink
          v-for="item in page.items"
          :key="item.name"
          :to="item.url"
          target="_blank"
          class="group flex flex-col gap-3 focus-visible:outline-primary"
        >
          <div class="rounded-xl border border-default overflow-hidden bg-muted/40">
            <NuxtImg
              :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
              :alt="`Screenshot of ${item.name}`"
              width="327"
              height="184"
              :modifiers="{ position: 'top' }"
              loading="lazy"
              class="aspect-video w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-300"
            />
          </div>

          <div class="flex items-center gap-2 min-w-0">
            <span class="text-sm font-semibold tracking-tight text-highlighted truncate">{{ item.name }}</span>
            <span class="text-xs text-muted truncate">{{ hostname(item.url) }}</span>
            <UIcon name="i-lucide-arrow-up-right" class="ms-auto size-4 shrink-0 text-dimmed group-hover:text-primary transition-colors" />
          </div>
        </NuxtLink>
      </div>
    </UContainer>
  </main>
</template>
