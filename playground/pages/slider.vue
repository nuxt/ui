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
      <USlider :min="4" :max="12" :step="2" :model-value="6" />
    </div>

    <div class="flex flex-col gap-4 w-48">
      <USlider :default-value="[0, 20]" />
      <USlider :model-value="[0, 20]" />
      <USlider :model-value="[0, 20, 80]" />
      <USlider :model-value="[0, 80]" :min-steps-between-thumbs="20" />
    </div>

    <div class="flex items-center gap-4">
      <USlider v-for="size in sizes" :key="size" v-model="value" :size="(size as any)" class="w-48" />
    </div>

    <div class="h-48 flex items-center gap-8">
      <USlider :model-value="[0, 20, 80]" orientation="vertical" />
      <USlider v-model="value" orientation="vertical" />
      <USlider :model-value="[0, 80]" :min-steps-between-thumbs="20" orientation="vertical" />
    </div>
  </div>
</template>
