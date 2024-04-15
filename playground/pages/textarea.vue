<script setup lang="ts">
import theme from '#build/ui/textarea'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4">
      <UTextarea placeholder="Search..." />
      <UTextarea placeholder="Search..." color="gray" />
      <UTextarea placeholder="Search..." color="primary" />
      <UTextarea placeholder="Search..." disabled />
      <UTextarea placeholder="You can't see me" variant="none" />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea v-for="size in sizes" :key="size" placeholder="Search..." :size="(size as any)" />
    </div>
    <div class="flex gap-4">
      <UTextarea autofocus />
      <UTextarea autofocus :autofocus-delay="500" />
      <UTextarea autoresize />
      <UTextarea autoresize :maxrows="5" :rows="1" />
    </div>
  </div>
</template>
