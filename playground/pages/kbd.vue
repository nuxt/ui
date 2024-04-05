<script setup lang="ts">
import theme from '#build/ui/kbd'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1">
      <UKbd value="⌘" />
      <UKbd value="K" />
    </div>
    <div class="flex items-center gap-1">
      <UKbd value="⌘" color="gray" />
      <UKbd value="K" color="gray" />
    </div>
    <div class="flex items-center gap-1">
      <UKbd value="⌘" color="black" />
      <UKbd value="K" color="black" />
    </div>
    <div class="flex items-center gap-1 -ml-[41px]">
      <template v-for="size in sizes" :key="size">
        <UKbd value="⌘" :size="(size as any)" />
        <UKbd value="K" :size="(size as any)" />
      </template>
    </div>
  </div>
</template>
