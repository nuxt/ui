<script setup lang="ts">
import theme from '#build/ui/page-card'

const colors = Object.keys(theme.variants.highlightColor)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  variant: [theme.defaultVariants.variant]
})

const highlight = ref(false)
const highlightColor = ref(theme.defaultVariants.highlightColor)
const spotlight = ref(false)
const spotlightColor = ref(theme.defaultVariants.spotlightColor)

const orientation = ref('vertical' as keyof typeof theme.variants.orientation)
const reverse = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USwitch v-model="highlight" label="Highlight" />
    <USelect v-model="highlightColor" :items="colors" />
    <USwitch v-model="spotlight" label="Spotlight" />
    <USelect v-model="spotlightColor" :items="colors" />
    <USelect v-model="orientation" :items="orientations" />
    <USwitch v-model="reverse" label="Reverse" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="flex-col gap-4">
    <UPageCard
      icon="i-lucide-palette"
      title="Design system"
      description="Build faster with Nuxt UI's CSS-first design system powered by Tailwind CSS and its semantic color system combined with a runtime configuration."
      to="https://ui.nuxt.com/docs/theme/design-system"
      target="_blank"
      :highlight="highlight"
      :highlight-color="highlightColor"
      :spotlight="spotlight"
      :spotlight-color="spotlightColor"
      :orientation="orientation"
      :reverse="reverse"
      v-bind="props"
      class="data-[orientation=vertical]:w-80"
    >
      <Placeholder class="size-full aspect-video" />
    </UPageCard>
  </Matrix>
</template>
