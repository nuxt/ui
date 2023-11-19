<template>
  <UList item-orientation="horizontal">
    <template #separator-before="{ index }">
      <div
        class="flex items-center text-right text-green-500 pr-1"
        :style="`padding-left: ${Math.max(0, index - 1)}em`"
      >
        <UIcon name="i-heroicons-arrow-uturn-right" class="-scale-y-100" />
      </div>
    </template>

    <div v-for="(item, key) in items" :key="key" class="flex items-center gap-2">
      {{ item.label }}
    </div>
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
