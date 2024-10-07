<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/badge'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <UBadge class="font-bold">
        Badge
      </UBadge>
    </div>
    <div class="flex items-center gap-2">
      <UBadge v-for="variant in variants" :key="variant" :label="upperFirst(variant)" :variant="variant" />
    </div>
    <div class="flex items-center gap-2">
      <UBadge v-for="variant in variants" :key="variant" :label="upperFirst(variant)" :variant="variant" color="neutral" />
    </div>
    <div class="flex items-center gap-2 ml-[-56px]">
      <UBadge v-for="size in sizes" :key="size" label="Badge" :size="size" />
    </div>
  </div>
</template>
