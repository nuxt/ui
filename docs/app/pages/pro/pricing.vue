<script setup lang="ts">
// @ts-expect-error yaml is not typed
import page from '.content/pricing.yml'

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
      class="relative"
      :description="page.pricing.description"
    >
      <template #title>
        <MDC :value="page.pricing.title" unwrap="p" />
      </template>
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>
      <UContainer>
        <UPricingPlan
          v-bind="page.pricing.freePlan"
          class="mb-16"
        />
        <UPricingPlans
          class="mb-16"
          scale
        >
          <UPricingPlan
            v-for="(plan, index) in page.pricing.plans"
            :key="index"
            :title="plan.title"
            :description="plan.description"
            :price="plan.price"
            :billing-period="plan.billing_period"
            :billing-cycle="plan.billing_cycle"
            :highlight="plan.highlight"
            :scale="plan.highlight"
            variant="soft"
            :features="plan.features"
            :button="plan.button"
          />
        </UPricingPlans>
        <UPricingPlan
          v-bind="page.pricing.figma"
        >
          <template #features>
            <li v-for="(feature, index) in page.pricing.figma.features" :key="index" class="flex items-center gap-2 min-w-0">
              <UIcon name="i-lucide-circle-check" class="size-5 text-(--ui-primary) shrink-0" />
              <MDC :value="feature" unwrap="p" class="text-sm truncate text-(--ui-text-toned)" />
            </li>
          </template>
        </UPricingPlan>
      </UContainer>
    </UPageHero>

    <UPageSection
      id="testimonials"
      v-bind="page.testimonials"
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
    >
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
