<script setup lang="ts">
import input from '#build/ui/input'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 -ml-[258px]">
      <UInput placeholder="Write something..." autofocus />
      <UInput placeholder="Write something..." />
      <UInput placeholder="Write something..." color="gray" />
      <UInput placeholder="Write something..." color="primary" />
      <UInput placeholder="Write something..." color="red" />
      <UInput placeholder="Write something..." disabled />
    </div>
    <div class="flex items-center gap-4">
      <UInput v-for="size in Object.keys(input.variants.size)" :key="size" placeholder="Write something..." :size="(size as any)" />
    </div>
  </div>
</template>
