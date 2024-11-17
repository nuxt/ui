<script setup lang="ts">
import theme from '#build/ui/color-picker'

const sizes = Object.keys(theme.variants.size)
const size = ref('md' as const)
</script>

<template>
  <div class="flex flex-col items-center gap-8">
    <div class="flex items-center gap-2">
      <USelect v-model="size" :items="sizes" placeholder="Size" />
    </div>

    <UColorPicker :size="size" color="primary" />

    <UColorPicker :size="size" inline />
  </div>
</template>
