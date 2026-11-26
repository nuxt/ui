<script setup lang="ts">
const value = ref('const fruits = [\'apple\', \'banana\', \'cherry\']\n\nfor (const fruit of fruits) {\n  console.log(fruit)\n}\n')
</script>

<template>
  <UCodeEditor v-model="value" lang="ts" class="w-full max-w-md">
    <template #search="{ query, findPrevious, findNext, close }">
      <UInput v-model="query.search" placeholder="Find" size="xs" icon="i-lucide-search" class="flex-1" />
      <USwitch v-model="query.caseSensitive" label="Aa" size="xs" />
      <UButton
        icon="i-lucide-arrow-up"
        size="xs"
        color="neutral"
        variant="ghost"
        aria-label="Previous"
        @click="findPrevious"
      />
      <UButton
        icon="i-lucide-arrow-down"
        size="xs"
        color="neutral"
        variant="ghost"
        aria-label="Next"
        @click="findNext"
      />
      <UButton
        icon="i-lucide-x"
        size="xs"
        color="neutral"
        variant="ghost"
        aria-label="Close"
        @click="close"
      />
    </template>
  </UCodeEditor>
</template>
