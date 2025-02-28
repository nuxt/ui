<script setup lang="ts">
import { joinURL } from 'ufo'
// @ts-expect-error yaml is not typed
import page from '.content/pro.yml'
// @ts-expect-error yaml is not typed
import templatesPage from '.content/templates.yml'

const { url } = useSiteConfig()

useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  ogImage: joinURL(url, '/pro/og-image.png'),
  description: page.description,
  ogDescription: page.description
})
</script>

<template>
  <div class="relative">
    <UPageHero
      :links="page.hero.links"
      class="relative"
      :ui="{
        container: 'relative !pb-0'
      }"
    >
      <template #title>
        <MDC :value="page.hero.title" unwrap="p" />
      </template>
      <template #description>
        <MDC :value="page.hero.description" unwrap="p" />
      </template>
      <template #top>
        <StarsBg />
      </template>

      <Motion as-child :initial="{ height: 0 }" :animate="{ height: 'auto' }" :transition="{ delay: 0.2, duration: 1 }">
        <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      </Motion>
      <div class="relative w-full h-[400px] border border-(--ui-border) bg-(--ui-bg-muted) overflow-hidden">
        <UPageMarquee reverse orientation="vertical" :overlay="false" :ui="{ root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in 4"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
        <UPageMarquee orientation="vertical" :overlay="false" :ui="{ root: '[--duration:40s] absolute w-[460px] -top-[400px] left-[480px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in [5, 6, 7, 8]"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
        <UPageMarquee reverse orientation="vertical" :overlay="false" :ui="{ root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[1020px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in [9, 10, 11, 12]"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
      </div>
    </UPageHero>
    <UPageCTA
      variant="outline"
      class="rounded-none"
      :ui="{
        container: 'sm:py-12 lg:py-12 sm:gap-4',
        description: 'sm:text-base'
      }"
    >
      <template #description>
        <Motion :initial="{ opacity: 0, transform: 'translateY(10px)' }" :in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }" :transition="{ delay: 0.2 }">
          <MDC :value="page.testimonial.quote" unwrap="p" class="before:content-[open-quote] after:content-[close-quote] " />
        </Motion>
      </template>
      <Motion :initial="{ opacity: 0, transform: 'translateY(10px)' }" :in-view="{ opacity: 1, transform: 'translateY(0)' }" :in-view-options="{ once: true }" :transition="{ delay: 0.3 }">
        <UUser
          v-bind="page.testimonial.user"
          class="justify-center"
        />
      </Motion>
    </UPageCTA>
    <UPageSection
      v-bind="page.features"
      :ui="{
        title: 'text-left',
        description: 'text-left',
        container: 'relative',
        wrapper: 'sm:px-8'
      }"
      class="border-t border-(--ui-border)"
    >
      <Motion as-child :initial="{ height: 0 }" :in-view="{ height: 'auto' }" :transition="{ delay: 0.4, duration: 1 }">
        <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      </Motion>
    </UPageSection>

    <UPageCTA
      v-if="page.mainSection"
      variant="naked"
      :ui="{
        container: 'lg:grid-cols-0 !gap-0 px-4 sm:px-6 lg:px-8',
        wrapper: 'grid grid-cols-1 lg:grid-cols-2',
        description: 'lg:mt-0' }"
      orientation="horizontal"
      class="rounded-none border-t border-(--ui-border) bg-gradient-to-b from-(--ui-bg-muted) to-(--ui-bg)"
    >
      <template #title>
        <MDC :value="page.mainSection.title" unwrap="p" />
      </template>
      <template #description>
        <MDC :value="page.mainSection.description" unwrap="p" />
      </template>
    </UPageCTA>
    <UPageSection
      v-for="(section, index) in page.sections"
      :key="index"
      :title="section.title"
      :description="section.description"
      :links="section.links"
      :reverse="section.reverse"
      :features="section.features"
      orientation="horizontal"
      :class="{ 'border-b border-(--ui-border)': index === page.sections.length - 1 }"
      :ui="{
        container: index === 0 ? 'pb-0 sm:pb-0 lg:pb-0 py-16 sm:py-16 lg:py-16' : ''
      }"
    >
      <MDC :value="section.code" />
    </UPageSection>

    <UPageSection
      id="templates"
      v-bind="page.templates"
      class="overflow-hidden border-x border-(--ui-border)"
      :ui="{ container: 'relative' }"
    >
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <UCarousel
        v-slot="{ item }"
        loop
        arrows
        dots
        wheel-gestures
        :autoplay="{ delay: 3000 }"
        :items="(templatesPage.templates as any[])"
        :ui="{
          item: 'basis-1/2',
          container: 'py-2',
          viewport: 'border-x border-(--ui-border)',
          arrows: 'hidden 2xl:block'
        }"
      >
        <UPageCard
          :to="item.links[0].to"
          target="_blank"
          variant="subtle"
          class="group"
          :ui="{ container: 'p-4 sm:p-4', title: 'flex items-center gap-1' }"
        >
          <template #title>
            <UIcon :name="item.icon" />
            <span>
              {{ item.title }}
            </span>
          </template>
          <UColorModeImage
            :light="item.thumbnail.light"
            :dark="item.thumbnail.dark"
            :alt="item.title"
            class="rounded-lg w-full border border-(--ui-border) aspect-video"
            loading="lazy"
          />
        </UPageCard>
      </UCarousel>
    </UPageSection>

    <USeparator />

    <UPageCTA
      v-bind="page.cta"
      variant="subtle"
      class="overflow-hidden"
      orientation="horizontal"
    >
      <StarsBg />
      <video
        class="rounded-[var(--ui-radius)] z-10"
        preload="none"
        poster="https://res.cloudinary.com/nuxt/video/upload/so_3.3/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.jpg"
        :controls="true"
      >
        <source
          src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.webm"
          type="video/webm"
        >
        <source
          src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.mp4"
          type="video/mp4"
        >
        <source
          src="https://res.cloudinary.com/nuxt/video/upload/v1708511800/ui-pro/video-nuxt-ui-pro_kwfbdh.ogg"
          type="video/ogg"
        >
      </video>
    </UPageCTA>
  </div>
</template>
