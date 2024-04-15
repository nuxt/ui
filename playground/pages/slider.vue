<script setup lang="ts">
import theme from '#build/ui/slider'

const sizes = Object.keys(theme.variants.size)

const value = ref(50)
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex flex-col gap-4 w-48">
      <USlider v-model="value" />
      <USlider :default-value="100" />
      <USlider color="green" />
      <USlider inverted />
      <USlider disabled />
      <USlider :min="4" :max="12" :step="2" />
    </div>

    <div class="flex flex-col gap-4 w-48">
      <USlider :model-value="[0, 10]" />
      <USlider :model-value="[0, 10, 30]" />
      <USlider :model-value="[0, 30]" :min-steps-between-thumbs="20" />
      <USlider :default-value="[0, 10]" />
    </div>

    <div class="flex items-center gap-4">
      <USlider v-for="size in sizes" :key="size" :size="(size as any)" class="w-32" />
    </div>

    <div class="h-48">
      <USlider v-model="value" orientation="vertical" />
    </div>
  </div>
</template>
