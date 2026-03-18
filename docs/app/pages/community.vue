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

defineOgImageComponent('Docs')
</script>

<template>
  <main v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      class="md:border-b border-default"
      :ui="{ container: 'relative py-10 sm:py-16 lg:py-24' }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection :ui="{ container: '!py-0' }">
      <div class="pb-16 sm:pb-24 lg:pb-32 md:border-x border-default">
        <UPageGrid class="gap-px">
          <UPageCard
            v-for="item in page.items"
            :key="item.label"
            :title="item.label"
            :description="item.description"
            :to="item.to"
            target="_blank"
            class="rounded-none group"
            :ui="{ footer: 'pointer-events-auto z-[1]' }"
          >
            <template #leading>
              <UAvatar v-bind="item.avatar" :alt="`${item.label} logo`" size="3xl" class="mx-auto" loading="lazy" />
            </template>

            <template v-if="item.user" #footer>
              <UButton
                :label="item.user.name"
                :avatar="{
                  ...item.user.avatar,
                  alt: `${item.user.name} avatar`
                }"
                :to="item.user.to"
                target="_blank"
                size="sm"
                color="neutral"
                variant="outline"
                class="ring-default group-hover:ring-accented transition bg-transparent"
              />
            </template>
          </UPageCard>
        </UPageGrid>
      </div>
    </UPageSection>
  </main>
</template>
