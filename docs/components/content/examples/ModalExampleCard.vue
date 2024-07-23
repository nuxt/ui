<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <Placeholder class="h-8" />
        </template>

        <Placeholder class="h-32" />

        <template #footer>
          <Placeholder class="h-8" />
        </template>
      </UCard>
    </UModal>
  </div>
</template>
