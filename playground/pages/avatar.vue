<script setup lang="ts">
import theme from '#build/ui/avatar'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" src="https://avatars.githubusercontent.com/u/739984?v=4" alt="Benjamin Canac" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" icon="i-heroicons-photo" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" alt="Benjamin Canac" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-1.5">
      <UAvatar v-for="size in sizes" :key="size" text="+1" :size="(size as any)" />
    </div>
  </div>
</template>
