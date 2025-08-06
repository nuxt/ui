<script setup lang="ts">
import theme from '#build/ui/kbd'
import { kbdKeysMap } from '@nuxt/ui/composables/useKbd.js'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
const colors = Object.keys(theme.variants.color) as Array<keyof typeof theme.variants.color>

const kbdKeys = Object.keys(kbdKeysMap)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="color in colors" :key="color" class="flex items-center gap-1 ms-[-22px]">
      <UKbd v-for="variant in variants" :key="`${color}-${variant}`" value="meta" :variant="variant" :color="color" />
    </div>
    <div class="flex items-center gap-1 ms-[-220px]">
      <UKbd v-for="(kdbKey, index) in kbdKeys" :key="index" :value="kdbKey" />
    </div>
    <div class="flex items-center gap-1 ms-[-22px]">
      <UKbd v-for="size in sizes" :key="size" value="meta" :size="size" />
    </div>
  </div>
</template>
