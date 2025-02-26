<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.figma.yml'
import { animate } from 'motion'
import { joinURL } from 'ufo'

const { url } = useSiteConfig()
useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description,
  ogImage: joinURL(url, '/pro/figma/og-image.png')
})

const video = ref<HTMLVideoElement | null>(null)
const played = ref(false)

onMounted(async () => {
  // Animate cursors
  await new Promise(resolve => setTimeout(resolve, 1000))
  const figmaWordPosition = document.querySelector('#figma')?.getBoundingClientRect()
  const nuxtWordPosition = document.querySelector('#nuxt')?.getBoundingClientRect()
  const initialScrollX = window.scrollX
  const initialScrollY = window.scrollY
  if (figmaWordPosition && nuxtWordPosition) {
    animate('#cursor1', { left: Math.round(Math.random() * window.outerWidth), top: Math.round(Math.random() * window.outerHeight) }, { duration: 0.1 })
      .then(() => animate('#cursor1', { opacity: 1 }, { duration: 0.3 }))
      .then(() => {
        return animate('#cursor1', {
          left: Math.round(figmaWordPosition.left + initialScrollX + figmaWordPosition.width / 2),
          top: Math.round(figmaWordPosition.top + initialScrollY - figmaWordPosition.height / 4)
        }, { duration: 1.5, delay: 0.2, ease: 'easeInOut' })
      })
      .then(() => animate('#cursor1', { scale: 0.8 }, { duration: 0.1, ease: 'easeOut' }))
      .then(() => animate('#cursor1', { scale: 1 }, { duration: 0.1, ease: 'easeOut' }))
      .then(() => animate('#figma', { color: 'var(--ui-info)' }, { duration: 0.3, ease: 'easeOut' }))
      .then(() => animate('#cursor1', { left: Math.round(figmaWordPosition.left + initialScrollX + figmaWordPosition.width), top: Math.round(figmaWordPosition.top + initialScrollY) }, { duration: 0.6, ease: 'easeInOut' }))

    animate('#cursor2', { left: Math.round(Math.random() * window.outerWidth), top: Math.round(Math.random() * window.outerHeight) }, { duration: 0.1, delay: 0.6 })
      .then(() => animate('#cursor2', { opacity: 1 }, { duration: 0.3 }))
      .then(() => {
        return animate('#cursor2', {
          left: Math.round(nuxtWordPosition.left + initialScrollX + nuxtWordPosition.width / 2),
          top: Math.round(nuxtWordPosition.top + initialScrollY - nuxtWordPosition.height / 4)
        }, { duration: 1.5, delay: 0.2, ease: 'easeInOut' })
      })
      .then(() => animate('#cursor2', { scale: 0.8 }, { duration: 0.1, ease: 'easeOut' }))
      .then(() => animate('#cursor2', { scale: 1 }, { duration: 0.1, ease: 'easeOut' }))
      .then(() => animate('#nuxt', { color: 'var(--ui-success)' }, { duration: 0.3, ease: 'easeOut' }))
      .then(() => animate('#cursor2', { left: Math.round(nuxtWordPosition.left + initialScrollX + nuxtWordPosition.width), top: Math.round(nuxtWordPosition.top + initialScrollY) }, { duration: 0.6, ease: 'easeInOut' }))
  }
})
</script>

<template>
  <div class="relative">
    <div id="cursor1" class="absolute z-10 pointer-events-none" :style="{ opacity: 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="absolute top-0 left-0 drop-shadow-[0_1px_2px_rgb(0,0,0,0.25)] text-white dark:text-(--ui-bg)">
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
        Sarah
      </UBadge>
    </div>
    <div id="cursor2" class="absolute z-10 pointer-events-none" :style="{ opacity: 0 }">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" class="absolute top-0 left-0 drop-shadow-[0_1px_2px_rgb(0,0,0,0.25)] text-white dark:text-(--ui-bg)">
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
        Sebastien
      </UBadge>
    </div>
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
      <!-- <img src="/pro/figma/nuxt-ui-figma.png" alt="Screnshot of the Nuxt UI Figma design kit" class="w-full h-auto border border-(--ui-border) border-b-0"> -->
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
      <Motion as-child :initial="{ height: 0 }" :animate="{ height: 'auto' }" :transition="{ delay: 0.2, duration: 1 }">
        <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      </Motion>
    </UPageHero>
    <UPageSection v-bind="page.features1" :ui="{ container: 'py-16 sm:py-16 lg:py-16', features: 'mt-0' }" class="border-y border-(--ui-border)" />
    <UPageCTA
      v-if="page.cta1"
      variant="naked"
      :ui="{
        container: 'lg:grid-cols-0 !gap-0 px-4 sm:px-6 lg:px-8',
        wrapper: 'grid grid-cols-1 lg:grid-cols-2',
        description: 'lg:mt-0' }"
      orientation="horizontal"
      class="rounded-none bg-gradient-to-b from-(--ui-bg-muted) to-(--ui-bg)"
    >
      <template #title>
        <MDC :value="page.cta1.title" unwrap="p" />
      </template>
      <template #description>
        <MDC :value="page.cta1.description" unwrap="p" />
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
            class="w-full h-auto rounded-[calc(var(--ui-radius)*2)]"
            lazy
          />
        </template>
      </UTabs>
    </UPageSection>
    <UPageSection v-bind="page.section2" orientation="horizontal" :ui="{ container: 'py-16 sm:py-16 lg:py-16' }">
      <NuxtImg
        v-if="page.section2.image"
        v-bind="page.section2.image"
        class="w-full h-auto rounded-[calc(var(--ui-radius)*2)]"
        lazy
      />
    </UPageSection>
    <UPageSection v-bind="page.section3" orientation="horizontal" :ui="{ container: 'py-16 sm:pt-16 lg:pt-16' }">
      <NuxtImg
        v-if="page.section3.image"
        v-bind="page.section3.image"
        class="w-full h-auto rounded-[calc(var(--ui-radius)*2)]"
        lazy
      />
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
        <MDC :value="page.section4.description" unwrap="p" />
      </template>
      <div aria-hidden="true" class="absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center border border-(--ui-border) border-b-0 sm:divide-x divide-y lg:divide-y-0 divide-(--ui-border)">
        <li v-for="(step, index) in page?.section4.steps" :key="step.title" class="flex flex-col gap-y-4 justify-start group h-full p-4">
          <NuxtImg
            v-if="step.image"
            v-bind="step.image"
            class="rounded-(--ui-radius)"
            lazy
          />
          <div>
            <h2 class="font-semibold inline-flex items-center gap-x-1">
              <UBadge :label="index + 1" size="sm" color="neutral" variant="subtle" class="rounded-full tabular-nums" /> {{ step.title }}
            </h2>
            <p class="text-(--ui-text-muted) text-sm">
              {{ step.description }}
            </p>
          </div>
        </li>
      </ul>
    </UPageSection>
    <UPageSection v-bind="page.features2" :ui="{ container: 'py-16 sm:py-16 lg:py-16', features: 'mt-0' }" class="border-y border-(--ui-border)" />
    <UPageSection
      v-if="page.pricing"
      :title="page.pricing.title"
      :description="page.pricing.description"
      orientation="vertical"
      :ui="{
        title: 'sm:text-left',
        description: 'sm:text-left',
        links: 'sm:justify-start',
        container: 'relative !pb-0',
        wrapper: 'sm:pl-8'
      }"
    >
      <div aria-hidden="true" class="absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <UPricingPlans compact class="-space-x-px">
        <UPricingPlan
          v-for="(plan, index) in page.pricing.plans"
          :key="index"
          :title="plan.title"
          :description="plan.description"
          :price="plan.price"
          :billing-period="plan.billing_period"
          :billing-cycle="plan.billing_cycle"
          :highlight="plan.highlight"
          :features="plan.features"
          :button="plan.button"
          :terms="plan.terms"
          class="rounded-none"
          :class="plan.class"
        >
          <template #features>
            <li v-for="(feature, i) in plan.features" :key="i" class="flex items-center gap-2 min-w-0">
              <UIcon name="i-lucide-circle-check" class="size-5 shrink-0 text-(--ui-primary)" />
              <MDC :value="feature" unwrap="p" tag="span" class="text-sm truncate text-(--ui-text-accented)" />
            </li>
          </template>
          <template #button>
            <div class="flex flex-col w-full items-center gap-2">
              <UButton v-bind="plan.button" block size="lg" />
              <UButton
                v-if="plan.extraButton"
                v-bind="plan.extraButton"
                block
                size="lg"
                variant="outline"
                color="neutral"
              />
            </div>
          </template>
        </UPricingPlan>
      </UPricingPlans>
    </UPageSection>
    <UPageCTA v-if="page.customers" :title="page.customers.title" :ui="{ title: '!text-base font-medium', container: 'sm:py-12 sm:gap-8' }" variant="outline" class="rounded-none">
      <UPageMarquee pause-on-hover :ui="{ root: '[--duration:40s]' }">
        <img
          v-for="(logo, index) in page.customers.items"
          :key="index"
          v-bind="logo"
          class="h-6 shrink-0 max-w-[140px] filter invert dark:invert-0"
        >
      </UPageMarquee>
    </UPageCTA>
    <UPageSection v-bind="page.faq" :ui="{ container: 'relative' }">
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <UPageAccordion
        multiple
        :items="(page.faq.items as any[])"
        class="max-w-4xl mx-auto"
      >
        <template #body="{ item }">
          <MDC :value="item.content" unwrap="p" />
        </template>
      </UPageAccordion>
    </UPageSection>
  </div>
</template>
