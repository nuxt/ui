<script setup lang="ts">
import theme from '#build/ui/slider'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const value = ref(50)
</script>

<template>
  <div class="flex flex-col gap-6 items-center">
    <div class="flex flex-col gap-6 w-48">
      <USlider v-model="value" />
      <USlider color="neutral" :model-value="50" />
      <USlider color="error" :model-value="50" />
      <USlider :default-value="100" />
      <USlider inverted />
      <USlider disabled />
      <USlider :min="4" :max="12" :step="2" :model-value="6" />
    </div>

    <div class="flex flex-col gap-6 w-48">
      <USlider :default-value="[0, 20]" />
      <USlider :model-value="[0, 20]" />
      <USlider :model-value="[0, 20, 80]" />
      <USlider :model-value="[0, 80]" :min-steps-between-thumbs="20" />
    </div>

    <div class="flex items-center gap-6">
      <USlider v-for="size in sizes" :key="size" v-model="value" :size="size" class="w-48" />
    </div>

    <div class="h-48 flex items-center gap-6">
      <USlider :model-value="[0, 20, 80]" orientation="vertical" />
      <USlider v-model="value" orientation="vertical" />
      <USlider :model-value="[0, 80]" :min-steps-between-thumbs="20" orientation="vertical" />
    </div>
  </div>
</template>
