<script setup lang="ts">
import theme from '#build/ui/pricing-plan'

const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  variant: [theme.defaultVariants.variant]
})

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="orientation" :items="orientations" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="gap-4" :class="orientation === 'horizontal' ? 'flex-col' : ''">
    <UPricingPlan
      title="Solo"
      description="For bootstrappers and indie hackers."
      price="$249"
      discount="$199"
      billing-period="with taxes"
      billing-cycle="/month"
      badge="Most popular"
      terms="14-day free trial"
      tagline="Pay once, own it forever"
      :features="[
        'One developer',
        'Unlimited projects',
        'Access to GitHub repository',
        'Lifetime access'
      ]"
      :button="{
        label: 'Buy now'
      }"
      :orientation="orientation"
      v-bind="props"
      class="data-[orientation=vertical]:w-96"
    />
  </Matrix>
</template>
