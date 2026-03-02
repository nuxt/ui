<script setup lang="ts">
import { animate } from 'motion-v'
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('figma', () => queryCollection('figma').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
  ogImage: joinURL(url, '/figma/og-image.png')
})

const video = ref<HTMLVideoElement | null>(null)
const played = ref(false)

const { width: windowWidth } = useWindowSize()
const isMobile = computed(() => windowWidth.value < 768)

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const figmaWordPosition = document.querySelector('#figma')?.getBoundingClientRect()
  const nuxtWordPosition = document.querySelector('#nuxt')?.getBoundingClientRect()
  const initialScrollX = window.scrollX
  const initialScrollY = window.scrollY

  if (figmaWordPosition && nuxtWordPosition) {
    const createCursorSequence = async (
      cursorId: string,
      targetWord: DOMRect,
      targetColor: string,
      wordId: string,
      delay: number = 0
    ) => {
      const maxWidth = isMobile.value ? windowWidth.value * 0.8 : window.outerWidth
      const maxHeight = isMobile.value ? window.innerHeight * 0.6 : window.outerHeight

      await animate(cursorId, {
        left: Math.round(Math.random() * maxWidth),
        top: Math.round(Math.random() * maxHeight)
      }, { duration: 0.1, delay }).finished

      await animate(cursorId, { opacity: 1 }, { duration: 0.3 }).finished

      const clickPositionX = isMobile.value
        ? Math.round(targetWord.left + initialScrollX + targetWord.width * 0.5)
        : Math.round(targetWord.left + initialScrollX + targetWord.width / 2)
      const clickPositionY = isMobile.value
        ? Math.round(targetWord.top + initialScrollY - targetWord.height / 1.5)
        : Math.round(targetWord.top + initialScrollY - targetWord.height / 4)

      await animate(cursorId, {
        left: clickPositionX,
        top: clickPositionY
      }, { duration: 1, delay: 0.2, ease: 'easeInOut' }).finished

      await animate(cursorId, { scale: 0.8 }, { duration: 0.1, ease: 'easeOut' }).finished
      await animate(cursorId, { scale: 1 }, { duration: 0.1, ease: 'easeOut' }).finished
      await animate(wordId, { color: targetColor }, { duration: 0.3, ease: 'easeOut' }).finished

      const finalPositionX = isMobile.value
        ? Math.round(targetWord.left + initialScrollX + targetWord.width * 1)
        : Math.round(targetWord.left + initialScrollX + targetWord.width)
      const finalPositionY = isMobile.value
        ? Math.round(targetWord.top + initialScrollY + targetWord.height * -0.5)
        : Math.round(targetWord.top + initialScrollY - targetWord.height / 6)

      await animate(cursorId, {
        left: finalPositionX,
        top: finalPositionY
      }, { duration: 0.5, ease: 'easeInOut' }).finished
    }

    await Promise.all([
      createCursorSequence('#cursor1', figmaWordPosition, 'var(--ui-info)', '#figma'),
      createCursorSequence('#cursor2', nuxtWordPosition, 'var(--ui-success)', '#nuxt', 0.5)
    ])
  }
})
</script>

<template>
  <main v-if="page" class="relative">
    <div id="cursor1" class="absolute z-10 pointer-events-none" :style="{ opacity: 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="absolute top-0 left-0 drop-shadow-[0_1px_2px_rgb(0,0,0,0.25)] text-inverted">
        <path
          fill="var(--ui-info)"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
        />
      </svg>
      <UBadge color="info" class="absolute top-[18px] left-[18px] py-1 px-1 rounded-sm font-semibold leading-none">
        Hugo
      </UBadge>
    </div>
    <div id="cursor2" class="absolute z-10 pointer-events-none" :style="{ opacity: 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="absolute top-0 left-0 drop-shadow-[0_1px_2px_rgb(0,0,0,0.25)] text-inverted">
        <path
          fill="var(--ui-success)"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
        />
      </svg>
      <UBadge color="success" class="absolute top-[18px] left-[18px] py-1 px-1 rounded-sm font-semibold leading-none">
        Sarah
      </UBadge>
    </div>

    <UPageHero
      :links="page.hero.links"
      class="relative"
      :ui="{ container: 'relative py-10 sm:py-16 lg:py-24 !pb-0' }"
    >
      <template #title>
        <MDC :value="page.hero.title" unwrap="p" cache-key="figma-hero-title" />
      </template>
      <template #description>
        <MDC :value="page.hero.description" unwrap="p" cache-key="figma-hero-description" />
      </template>
      <!-- <img src="/figma/nuxt-ui-figma.png" alt="Screnshot of the Nuxt UI Figma design kit" class="w-full h-auto border border-default border-b-0"> -->
      <div class="relative">
        <video
          ref="video"
          :controls="played"
          playsinline
          src="https://res.cloudinary.com/nuxt/video/upload/v1739267662/ui-pro/video4_aobki0.mp4"
          poster="https://res.cloudinary.com/nuxt/video/upload/so_0/v1739267662/ui-pro/video4_aobki0.jpg"
          :class="{ grayscale: !played }"
        />
        <div v-if="!played" class="group cursor-pointer absolute inset-0 flex items-center justify-center backdrop-blur-xs" @click="video?.play(); played = true">
          <UButton
            icon="i-heroicons-play-20-solid"
            size="xl"
            color="neutral"
            variant="solid"
            class="group-hover:scale-105 transition-transform cursor-pointer drop-shadow-xl"
            aria-label="Play video"
            :ui="{
              base: 'p-4'
            }"
          >
            Watch 1 min demo
          </UButton>
        </div>
      </div>

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>
    <UPageSection v-bind="page.features1" :ui="{ container: 'py-16 sm:py-16 lg:py-16', features: 'mt-0' }" class="border-y border-default" />
    <UPageCTA
      v-if="page.cta1"
      variant="naked"
      :ui="{
        container: 'lg:grid-cols-0 !gap-0 px-4 sm:px-6 lg:px-8',
        wrapper: 'grid grid-cols-1 lg:grid-cols-2',
        description: 'mt-2'
      }"
      orientation="horizontal"
      class="rounded-none bg-gradient-to-b from-elevated/50 to-default"
    >
      <template #title>
        <MDC :value="page.cta1.title" unwrap="p" cache-key="figma-cta-1-title" />
      </template>
      <template #description>
        <MDC :value="page.cta1.description" unwrap="p" cache-key="figma-cta-1-description" />
      </template>
    </UPageCTA>
    <UPageSection v-bind="page.section1" orientation="horizontal" :ui="{ container: 'py-16 sm:py-16 lg:py-16' }">
      <UTabs :items="(page.section1.tabs as any[])" size="sm" color="neutral" :unmount-on-hide="false">
        <template #content="{ item }">
          <NuxtImg
            :width="item.width"
            :height="item.height"
            :src="item.src"
            :alt="item.alt"
            class="w-full h-auto rounded-lg"
            loading="lazy"
          />
        </template>
      </UTabs>
    </UPageSection>
    <UPageSection v-bind="page.section2" orientation="horizontal" :ui="{ container: 'py-16 sm:py-16 lg:py-16' }">
      <NuxtImg v-if="page.section2.image" v-bind="page.section2.image" class="w-full h-auto rounded-lg" loading="lazy" />
    </UPageSection>
    <UPageSection v-bind="page.section3" orientation="horizontal" :ui="{ container: 'py-16 sm:pt-16 lg:pt-16' }">
      <NuxtImg v-if="page.section3.image" v-bind="page.section3.image" class="w-full h-auto rounded-lg" loading="lazy" />
    </UPageSection>
    <USeparator />
    <UPageSection
      v-bind="page.section4"
      orientation="vertical"
      :ui="{
        title: 'sm:text-left',
        description: 'sm:text-left',
        links: 'sm:justify-start',
        container: 'relative !pb-0',
        wrapper: 'sm:pl-8'
      }"
    >
      <template #description>
        <MDC :value="page.section4.description" unwrap="p" cache-key="figma-section-4-description" />
      </template>
      <div aria-hidden="true" class="absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center border border-default border-b-0 sm:divide-x divide-y lg:divide-y-0 divide-default">
        <li v-for="(step, index) in page?.section4.steps" :key="step.title" class="relative flex flex-col gap-y-4 justify-start group h-full p-4 bg-default" :class="{ 'hover:bg-muted/50': step.to }">
          <ULink v-if="step.to" :to="step.to" :aria-label="`Open ${step.title}`" target="_blank" class="absolute inset-0 z-10" />
          <NuxtImg v-if="step.image" v-bind="step.image" class="rounded-sm" loading="lazy" />
          <div>
            <h2 class="font-semibold inline-flex items-center gap-x-1">
              <UBadge :label="index + 1" size="sm" color="neutral" variant="subtle" class="rounded-full tabular-nums" /> {{ step.title }}
            </h2>
            <p class="text-muted text-sm">
              {{ step.description }}
            </p>
          </div>
        </li>
      </ul>
    </UPageSection>
    <UPageSection v-bind="page.features2" :ui="{ container: 'py-16 sm:py-16 lg:py-16', features: 'mt-0' }" class="border-y border-default" />

    <UPageCTA v-if="page.customers" :title="page.customers.title" :ui="{ title: '!text-base font-medium', container: 'sm:py-12 sm:gap-8' }" variant="outline" class="rounded-none">
      <UMarquee pause-on-hover :ui="{ root: '[--duration:40s]' }">
        <img v-for="(logo, index) in page.customers.items" :key="index" v-bind="logo" class="h-6 shrink-0 max-w-[140px] filter invert dark:invert-0" loading="lazy">
      </UMarquee>
    </UPageCTA>
    <UPageSection v-bind="page.faq" :ui="{ container: 'relative' }">
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <UAccordion
        type="multiple"
        :items="(page.faq.items as any[])"
        :unmount-on-hide="false"
        class="max-w-4xl mx-auto"
        :ui="{
          trigger: 'text-base',
          body: 'text-base text-muted'
        }"
      >
        <template #body="{ item, index }">
          <MDC :value="item.content" unwrap="p" :cache-key="`figma-faq-${index}-content`" />
        </template>
      </UAccordion>
    </UPageSection>
  </main>
</template>
