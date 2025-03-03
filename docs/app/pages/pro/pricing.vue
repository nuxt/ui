<script setup lang="ts">
import { joinURL } from 'ufo'
// @ts-expect-error yaml is not typed
import page from '.content/pricing.yml'

const { url } = useSiteConfig()

useSeoMeta({
  title: page.title,
  ogTitle: page.title,
  description: page.description,
  ogDescription: page.description,
  ogImage: joinURL(url, '/pro/og-image.png')
})
</script>

<template>
  <div class="relative">
    <UPageHero
      class="relative"
      :description="page.pricing.description"
      :ui="{
        container: 'relative lg:!pb-0'
      }"
    >
      <template #title>
        <MDC :value="page.pricing.title" unwrap="p" />
      </template>
      <template #top>
        <StarsBg />
      </template>
      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <div class="flex flex-col bg-(--ui-bg) gap-8 lg:gap-0">
        <UPricingPlan
          v-bind="page.pricing.freePlan"
          variant="naked"
          class="lg:rounded-none border-x border-(--ui-border) border-t border-b lg:border-b-0"
        />
        <UPricingPlans compact>
          <UPricingPlan
            v-for="(plan, index) in page.pricing.plans"
            :key="index"
            :title="plan.title"
            :description="plan.description"
            :price="plan.price"
            :billing-period="plan.billing_period"
            :billing-cycle="plan.billing_cycle"
            :variant="plan.highlight ? 'soft' : 'outline'"
            :class="['lg:rounded-none', { 'border-2 lg:border lg:border-x-0 border-(--ui-primary) lg:border-(--ui-border)': plan.highlight }]"
            :features="plan.features"
            :button="plan.button"
          />
        </UPricingPlans>
        <UPricingPlan
          v-bind="page.pricing.figma"
          variant="naked"
          class="lg:rounded-none border lg:border-y-0 border-(--ui-border)"
        >
          <template #features>
            <li v-for="(feature, index) in page.pricing.figma.features" :key="index" class="flex items-center gap-2 min-w-0">
              <UIcon name="i-lucide-circle-check" class="size-5 text-(--ui-primary) shrink-0" />
              <MDC :value="feature" unwrap="p" class="text-sm truncate text-(--ui-text-toned)" />
            </li>
          </template>
        </UPricingPlan>
      </div>
    </UPageHero>

    <UPageSection
      id="testimonials"
      v-bind="page.testimonials"
      class="border-y border-(--ui-border)"
    >
      <UPageMarquee pause-on-hover :ui="{ root: '[--duration:40s]' }">
        <img
          v-for="(logo, index) in page.logos"
          :key="index"
          v-bind="logo"
          class="h-6 shrink-0 max-w-[140px] filter invert dark:invert-0"
        >
      </UPageMarquee>
      <UContainer>
        <UPageColumns class="xl:columns-4">
          <UPageCard
            v-for="(testimonial, index) in page.testimonials.items"
            :key="index"
            variant="subtle"
            :description="testimonial.quote"
            :ui="{ description: 'before:content-[open-quote] after:content-[close-quote]' }"
          >
            <template #footer>
              <UUser
                v-bind="testimonial.user"
                size="xl"
              />
            </template>
          </UPageCard>
        </UPageColumns>
      </UContainer>
    </UPageSection>

    <UPageSection
      id="faq"
      v-bind="page.faq"
      class="scroll-mt-(--ui-header-height)"
      :ui="{ container: 'relative' }"
    >
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
