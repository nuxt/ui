<script setup lang="ts">
import theme from '#build/ui/checkbox'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant)
const variant = ref('list' as const)

const checked = ref(true)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <USelect v-model="variant" :items="variants" />
    <div class="flex flex-col gap-4">
      <UCheckbox v-model="checked" label="Primary" :variant="variant" />
      <UCheckbox label="Neutral" color="neutral" :variant="variant" :default-value="true" />
      <UCheckbox label="Error" color="error" :variant="variant" :model-value="true" />
      <UCheckbox label="Icon" icon="i-lucide-heart" :variant="variant" :model-value="true" />
      <UCheckbox label="Default value" :variant="variant" :default-value="true" />
      <UCheckbox label="Indeterminate" :variant="variant" default-value="indeterminate" />
      <UCheckbox label="Required" :variant="variant" required />
      <UCheckbox label="Disabled" :variant="variant" disabled />
    </div>
    <div class="flex items-center gap-4 me-[-11px]">
      <UCheckbox v-for="size in sizes" :key="size" label="Check me" :size="size" :variant="variant" />
    </div>
    <div class="flex items-center gap-4 me-[-96px]">
      <UCheckbox
        v-for="size in sizes"
        :key="size"
        label="Check me"
        description="This is a description"
        :size="size"
        :variant="variant"
      />
    </div>
  </div>
</template>
