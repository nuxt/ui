<script setup lang="ts">
import theme from '#build/ui/page-cta'

const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  variant: [theme.defaultVariants.variant]
})

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)
const reverse = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="orientation" :items="orientations" />
    <USwitch v-model="reverse" label="Reverse" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="flex-col gap-4">
    <UPageCTA
      title="Ready to build your next Nuxt app?"
      description="Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today."
      :links="[{
        label: 'Start building',
        to: 'https://ui.nuxt.com/docs/getting-started/installation/nuxt',
        target: '_blank',
        trailingIcon: 'i-lucide-arrow-right',
        color: 'neutral'
      }, {
        label: 'View on GitHub',
        to: 'https://github.com/nuxt/ui',
        target: '_blank',
        icon: 'simple-icons:github',
        color: 'neutral',
        variant: 'outline'
      }]"
      :orientation="orientation"
      :reverse="reverse"
      v-bind="props"
    >
      <Placeholder v-if="orientation === 'horizontal'" class="size-full min-h-48" />
    </UPageCTA>
  </Matrix>
</template>
