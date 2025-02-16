<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.content/pro.yml'

useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description
})
defineOgImageComponent('Docs', {
  headline: 'Pro'
})
</script>

<template>
  <div class="relative">
    <UPageHero
      :links="page.hero.links"
      class="relative"
      orientation="horizontal"
    >
      <template #title>
        <MDC :value="page.hero.title" unwrap="p" />
      </template>
      <template #description>
        <MDC :value="page.hero.description" unwrap="p" />
      </template>
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>

      <PromotionalVideo />
    </UPageHero>

    <UPageSection
      v-bind="page.features"
      :ui="{ title: 'text-left', description: 'text-left' }"
    />

    <UPageCTA
      :description="page.authorQuote.quote"
      variant="soft"
      class="rounded-none"
      :ui="{ container: 'sm:py-12 lg:py-12 sm:gap-8', description: 'before:content-[open-quote] after:content-[close-quote]' }"
    >
      <UUser
        v-bind="page.authorQuote.user"
        size="xl"
        class="justify-center"
      />
    </UPageCTA>

    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      v-bind="section"
      orientation="horizontal"
    >
      <MDC :value="section.code" />
    </UPageSection>

    <UPageSection
      id="templates"
      v-bind="page.templates"
      class="overflow-hidden"
    >
      <UCarousel
        v-slot="{ item }"
        loop
        arrows
        dots
        :autoplay="{ delay: 3000 }"
        :items="(page.templates.items as any[])"
        :ui="{ item: 'basis-1/2', container: 'py-2' }"
      >
        <UPageCard
          :to="item.to"
          :description="item.description"
          class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }"
        >
          <template #title>
            <UIcon :name="item.icon" />
            <span>
              {{ item.title }}
            </span>
          </template>
          <img
            :src="item.image"
            :alt="item.title"
            class="rounded-lg grayscale group-hover:grayscale-0 transition-all duration-200 ease-in-out"
          >
        </UPageCard>
      </UCarousel>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="naked"
      class="overflow-hidden"
    >
      <div class="absolute rounded-full dark:bg-(--ui-primary) blur-[250px] size-40 sm:size-50 transform -translate-x-1/2 left-1/2 -translate-y-80" />

      <StarsBg />
    </UPageCTA>
  </div>
</template>
