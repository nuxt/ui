<script setup lang="ts">
import theme from '#build/ui/kbd'
import { kbdKeysMap } from '@nuxt/ui/runtime/composables/useKbd.js'

const sizes = Object.keys(theme.variants.size)
const kbdKeys = Object.keys(kbdKeysMap)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1">
      <UKbd value="meta" />
    </div>
    <div class="flex items-center gap-1">
      <UKbd value="meta" color="gray" />
    </div>
    <div class="flex items-center gap-1">
      <UKbd value="meta" color="black" />
    </div>
    <div class="flex items-center gap-1 ml-[-216px]">
      <UKbd v-for="(kdbKey, index) in kbdKeys" :key="index" :value="kdbKey" />
    </div>
    <div class="flex items-center gap-1 ml-[-22px]">
      <UKbd v-for="size in sizes" :key="size" value="meta" :size="(size as any)" />
    </div>
  </div>
</template>
