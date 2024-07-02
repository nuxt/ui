<script setup lang="ts">
import theme from '#build/ui/textarea'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-60">
      <UTextarea autofocus />
      <UTextarea placeholder="Search..." color="gray" />
      <UTextarea placeholder="Search..." color="primary" />
      <UTextarea placeholder="Search..." variant="none" />
      <UTextarea placeholder="Search..." disabled />
      <UTextarea autoresize :maxrows="5" :rows="1" />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea v-for="size in sizes" :key="size" placeholder="Search..." :size="size" class="w-60" />
    </div>
  </div>
</template>
