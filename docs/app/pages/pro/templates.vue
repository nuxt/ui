<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.content/templates.yml'

useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description
})
defineOgImageComponent('Docs', {
  headline: 'Pro'
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="relative">
    <UPageHero :links="page.links">
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>

      <template #title>
        <MDC :value="page.hero.title" unwrap="p" />
      </template>

      <template #description>
        <MDC :value="page.hero.description" unwrap="p" />
      </template>
    </UPageHero>

    <UPageSection
      v-for="(template, index) in page.templates"
      :key="index"
      :title="template.title"
      :links="template.links"
      :features="template.features"
      orientation="horizontal"
      reverse
      class="*:!pt-0"
      :ui="{ title: 'lg:text-4xl' }"
    >
      <template #description>
        <MDC :value="template.description" unwrap="p" />
      </template>

      <UColorModeImage
        v-if="template.thumbnail"
        v-bind="template.thumbnail"
        class="w-full h-auto rounded-(--ui-radius) border border-(--ui-border)"
        width="656"
        height="369"
      />
      <UCarousel
        v-else-if="template.images"
        v-slot="{ item }"
        :items="(template.images as any[])"
        dots
      >
        <NuxtImg v-bind="item" class="w-full h-full object-cover" width="576" height="360" />
      </UCarousel>
      <Placeholder v-else class="w-full h-full aspect-video" />
    </UPageSection>
  </div>
</template>
