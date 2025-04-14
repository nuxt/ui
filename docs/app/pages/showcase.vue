<script setup lang="ts">
const { data: page } = await useAsyncData('showcase', () => queryCollection('showcase').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs', {
  headline: 'Community'
})
</script>

<template>
  <UMain v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{
        wrapper: 'lg:px-12',
        container: 'relative'
      }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <div class="border-l border-t border-(--ui-border)">
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center divide-y divide-x divide-(--ui-border)">
          <li
            v-for="item in page.items"
            :key="item.name"
            class="group relative flex items-center justify-center flex-1 size-full p-2 last:border-r last:border-b border-(--ui-border) overflow-hidden"
          >
            <NuxtLink class="inset-0 absolute" :to="item.url" target="_blank">
              <span class="sr-only">Go to {{ item.name }}</span>
            </NuxtLink>

            <NuxtImg
              :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
              :alt="`Screenshot of ${item.name}`"
              width="327"
              height="184"
              :modifiers="{
                position: 'top'
              }"
              class="aspect-[16/9] size-full opacity-75 group-hover:opacity-100 group-hover:scale-110 duration-200 transition-[scale,opacity] pointer-events-none"
            />

            <div class="absolute flex items-center px-2.5 py-0.75 gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none bg-black/90 rounded-full">
              <span class="text-sm text-white font-medium">
                {{ item.name }}
              </span>
              <UIcon name="i-lucide-arrow-up-right" class="size-4 shrink-0 text-white" />
            </div>
          </li>
        </ul>
      </div>

      <div class="flex justify-center -mb-[36px]">
        <UButton
          label="Submit your project"
          trailing-icon="i-lucide-plus"
          color="neutral"
          size="lg"
          to="https://github.com/nuxt/ui/edit/v3/docs/content/showcase.yml"
          target="_blank"
        />
      </div>
    </UPageHero>
  </UMain>
</template>
