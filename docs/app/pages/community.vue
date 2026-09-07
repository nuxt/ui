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

    <UContainer class="max-w-[1180px] pt-12 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="item in page.items"
          :key="item.label"
          :to="item.to"
          target="_blank"
          class="group flex flex-col gap-3 rounded-2xl border border-default p-5 hover:border-accented hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition focus-visible:outline-primary"
        >
          <UAvatar
            v-bind="item.avatar"
            :alt="`${item.label} logo`"
            size="lg"
            loading="lazy"
            class="rounded-xl bg-elevated"
          />

          <span class="font-semibold tracking-tight text-highlighted">{{ item.label }}</span>

          <p class="text-[13.5px] leading-relaxed text-muted text-pretty">
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
