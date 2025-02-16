<script setup lang="ts">
import theme from '#build/ui/checkbox'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const checked = ref(true)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4">
      <UCheckbox v-model="checked" label="Primary" />
      <UCheckbox label="Neutral" color="neutral" :default-value="true" />
      <UCheckbox label="Error" color="error" :model-value="true" />
      <UCheckbox label="Icon" icon="i-lucide-heart" :model-value="true" />
      <UCheckbox label="Default value" :default-value="true" />
      <UCheckbox label="Indeterminate" default-value="indeterminate" />
      <UCheckbox label="Required" required />
      <UCheckbox label="Disabled" disabled />
    </div>
    <div class="flex items-center gap-4 me-[-11px]">
      <UCheckbox v-for="size in sizes" :key="size" label="Check me" :size="size" />
    </div>
    <div class="flex items-center gap-4 me-[-96px]">
      <UCheckbox v-for="size in sizes" :key="size" label="Check me" description="This is a description" :size="size" />
    </div>
  </div>
</template>
