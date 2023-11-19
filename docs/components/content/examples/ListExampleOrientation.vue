<template>
  <UList orientation="horizontal">
    <div v-for="(item, key) in items" :key="key" class="flex items-center gap-2">
      {{ item.label }}
    </div>

    <template #separator-after>
      <div class="flex items-center px-1 text-gray-400 dark:text-gray-600">
        <UIcon name="i-heroicons-chevron-right" />
      </div>
    </template>
  </UList>
</template>

<script setup>
const items = [
  { label: 'Home' },
  { label: 'Profile' },
  { label: 'Security' },
  { label: 'Password Reset' }
]
</script>
