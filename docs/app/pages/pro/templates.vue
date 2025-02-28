<script setup lang="ts">
import { joinURL } from 'ufo'
// @ts-expect-error yaml is not typed
import page from '.content/templates.yml'

const { url } = useSiteConfig()

useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description,
  ogImage: joinURL(url, '/pro/templates/og-image.png')
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <UPageHero :links="page.links" :ui="{ container: 'relative' }">
    <template #top>
      <StarsBg />
    </template>
    <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />

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
    class="lg:border-t border-(--ui-border)"
    :ui="{
      title: 'lg:text-4xl',
      wrapper: 'lg:py-16 lg:border-r border-(--ui-border) order-last lg:pr-16',
      container: 'lg:py-0'
    }"
  >
    <template #description>
      <MDC :value="template.description" unwrap="p" />
    </template>

    <div class="lg:border-x border-(--ui-border) h-full flex items-center lg:bg-(--ui-bg-muted)/20">
      <Motion :initial="{ opacity: 0, transform: 'translateY(10px)' }" :in-view="{ opacity: 1, transform: 'translateY(0px)' }" :in-view-options="{ once: true }" :transition="{ duration: 0.5, delay: 0.2 }">
        <UColorModeImage
          v-if="template.thumbnail"
          v-bind="template.thumbnail"
          class="w-full h-auto border lg:border-y lg:border-x-0 border-(--ui-border) rounded-(--ui-radius) lg:rounded-none"
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
          <NuxtImg v-bind="item" class="w-full h-full object-cover" width="576" height="360" />
        </UCarousel>
        <Placeholder v-else class="w-full h-full aspect-video" />
      </Motion>
    </div>
  </UPageSection>
</template>
