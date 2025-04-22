<script setup lang="ts">
import theme from '#build/ui/checkbox'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant)
const variant = ref('list' as const)
const indicators = Object.keys(theme.variants.indicator) as Array<keyof typeof theme.variants.indicator>
const indicator = ref('start' as const)

const checked = ref(true)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-4">
      <USelect v-model="variant" :items="variants" />
      <USelect v-model="indicator" :items="indicators" />
    </div>

    <div class="flex flex-col gap-4">
      <UCheckbox v-model="checked" label="Primary" :variant="variant" :indicator="indicator" orientation="horizontal" />
      <UCheckbox label="Neutral" color="neutral" :variant="variant" :indicator="indicator" :default-value="true" />
      <UCheckbox label="Error" color="error" :variant="variant" :indicator="indicator" :model-value="true" />
      <UCheckbox label="Icon" icon="i-lucide-heart" :variant="variant" :indicator="indicator" :model-value="true" />
      <UCheckbox label="Default value" :variant="variant" :indicator="indicator" :default-value="true" />
      <UCheckbox label="Indeterminate" :variant="variant" :indicator="indicator" default-value="indeterminate" />
      <UCheckbox label="Required" :variant="variant" :indicator="indicator" required />
      <UCheckbox label="Disabled" :variant="variant" :indicator="indicator" disabled />
    </div>
    <div class="flex items-center gap-4 me-[-11px]">
      <UCheckbox
        v-for="size in sizes"
        :key="size"
        label="Check me"
        :size="size"
        :variant="variant"
        :indicator="indicator"
      />
    </div>
    <div class="flex items-center gap-4 me-[-96px]">
      <UCheckbox
        v-for="size in sizes"
        :key="size"
        label="Check me"
        description="This is a description"
        :size="size"
        :variant="variant"
        :indicator="indicator"
      />
    </div>
  </div>
</template>
