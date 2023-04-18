<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id" class="scroll-mt-[161px] lg:scroll-mt-[112px]">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />

      <div class="absolute -left-4 rounded-md p-1 bg-gray-800 invisible gorup-hover:visible">
        <UIcon name="i-heroicons-hashtag" class="w-4 h-4 inline-block text-primary-500 dark:text-primary-400" />
      </div>
    </NuxtLink>
  </h2>
</template>
