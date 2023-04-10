<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id" class="scroll-mt-[161px] lg:scroll-mt-[112px]">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />

      <UIcon name="i-heroicons-hashtag" class="w-4 h-4 inline-block opacity-0 group-hover:opacity-100 text-primary-500 dark:text-primary-400 transition-opacity ml-2" />
    </NuxtLink>
  </h2>
</template>
