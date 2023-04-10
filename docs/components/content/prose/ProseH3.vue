<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h3 :id="id" class="scroll-mt-[145px] lg:scroll-mt-[96px]">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <UIcon name="i-heroicons-hashtag" class="w-3 h-3 inline-block opacity-0 group-hover:opacity-100 text-primary-500 dark:text-primary-400 transition-opacity ml-2" />
    </NuxtLink>
  </h3>
</template>
