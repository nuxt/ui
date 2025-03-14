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

const endDate = new Date('2025-03-14T23:59:59Z')
const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24

function getCountdown() {
  const distance = Math.floor((endDate.getTime() - Date.now()))
  return {
    day: Math.floor(distance / day),
    hour: Math.floor((distance % (day)) / (hour)),
    minute: Math.floor((distance % (hour)) / (minute)),
    second: Math.floor((distance % (minute)) / (second)),
    distance
  }
}
const countdown = ref(getCountdown())
let interval: any
if (countdown.value.distance > 0) {
  onMounted(() => {
    interval = setInterval(() => {
      countdown.value = getCountdown()
      if (countdown.value.distance <= 0) {
        clearInterval(interval)
      }
    }, 1000)
  })
}
const plural = (value: number) => (value === 1 ? '' : 's')
const double = (value: number) => (value < 10 ? `0${value}` : value)
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
      <template v-if="countdown.distance >= 0" #links>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white text-sm mb-3">
            Nuxt UI v3 launch offer ends in:
          </p>

          <div class="flex items-center justify-center gap-2 text-center">
            <template v-for="(value, key) in countdown" :key="key">
              <div v-if="key !== 'distance'" class="flex flex-col items-center gap-2">
                <UBadge color="primary" class="w-14 h-14 font-bold text-2xl flex items-center justify-center tabular-nums" variant="subtle">
                  {{ double(value) }}
                </UBadge>
                <span class="text-[10px] font-semibold text-gray-900 dark:text-white tracking-wide tabular-nums uppercase">{{ key }}{{ plural(value) }}</span>
              </div>
            </template>
          </div>
        </div>
      </template>

      <template #title>
        <MDC :value="page.pricing.title" unwrap="p" cache-key="pro-pricing-title" />
      </template>

      <StarsBg />
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
            :discount="plan.discount"
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
          :billing-period="page.pricing.figma.billing_period"
          :billing-cycle="page.pricing.figma.billing_cycle"
          class="lg:rounded-none border lg:border-y-0 border-(--ui-border)"
        >
          <template #features>
            <li v-for="(feature, index) in page.pricing.figma.features" :key="index" class="flex items-center gap-2 min-w-0">
              <UIcon name="i-lucide-circle-check" class="size-5 text-(--ui-primary) shrink-0" />
              <MDC :value="feature" unwrap="p" class="text-sm truncate text-(--ui-text-toned)" :cache-key="`pro-pricing-figma-feature-${index}`" />
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
        <template #body="{ item, index }">
          <MDC :value="item.content" unwrap="p" :cache-key="`pro-pricing-faq-${index}-content`" />
        </template>
      </UPageAccordion>
    </UPageSection>
  </div>
</template>
