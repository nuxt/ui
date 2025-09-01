<script setup lang="ts">
const { data: page } = await useAsyncData('templates', () => queryCollection('templates').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs', {
  headline: 'Community'
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div v-if="page" class="relative">
    <UPageHero :links="page.links" :ui="{ container: 'relative' }">
      <LazyStarsBg />

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="pro-templates-hero-title" />
      </template>

      <template #description>
        <MDC :value="page.hero.description" unwrap="p" cache-key="pro-templates-hero-description" />
      </template>

      <template #links>
        <FrameworkSelect size="md" class="w-48" />
      </template>
    </UPageHero>

    <UPageSection
      v-for="(template, index) in page.templates"
      :key="index"
      :title="template.title"
      :links="template.links"
      :features="template.features"
      orientation="horizontal"
      class="lg:border-t border-default"
      :class="`${template.framework}-only`"
      :ui="{
        title: 'lg:text-4xl',
        wrapper: 'lg:py-16 lg:border-r border-default order-last lg:pr-16',
        container: 'lg:py-0',
        links: 'gap-x-3'
      }"
    >
      <template #description>
        <MDC :value="template.description" unwrap="p" :cache-key="`pro-templates-${index}-description`" />
      </template>

      <div class="lg:border-x border-default h-full flex items-center lg:bg-muted/20">
        <Motion class="flex-1" :initial="{ opacity: 0, transform: 'translateY(10px)' }" :while-in-view="{ opacity: 1, transform: 'translateY(0px)' }" :in-view-options="{ once: true }" :transition="{ duration: 0.5, delay: 0.2 }">
          <UColorModeImage
            v-if="template.thumbnail"
            v-bind="template.thumbnail"
            class="w-full h-auto border lg:border-y lg:border-x-0 border-default rounded-sm lg:rounded-none"
            :alt="`Template ${index} thumbnail`"
            width="656"
            height="369"
            loading="lazy"
          />
          <UCarousel
            v-else-if="template.images"
            v-slot="{ item }"
            :items="(template.images as any[])"
            dots
          >
            <NuxtImg v-bind="item" class="w-full h-full object-cover" width="576" height="360" loading="lazy" />
          </UCarousel>
          <Placeholder v-else class="w-full h-full aspect-video" />
        </Motion>
      </div>
    </UPageSection>
  </div>
</template>
