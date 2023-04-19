<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h3 :id="id" class="scroll-mt-[145px] lg:scroll-mt-[96px]">
    <NuxtLink :href="`#${id}`" class="group">
      <div class="-ml-6 pr-2 py-2 inline-flex opacity-0 group-hover:opacity-100 transition-opacity absolute">
        <UIcon name="i-heroicons-hashtag-20-solid" class="w-4 h-4 text-primary-500 dark:text-primary-400" />
      </div>

      <slot />
    </NuxtLink>
  </h3>
</template>
