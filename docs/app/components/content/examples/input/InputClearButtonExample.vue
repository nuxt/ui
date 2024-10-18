<script setup lang="ts">
const value = ref('Click to clear')
</script>

<template>
  <UInput
    v-model="value"
    placeholder="Type something..."
    :ui="{ trailing: 'pr-0.5' }"
  >
    <template v-if="value?.length" #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="i-heroicons-x-circle"
        aria-label="Clear input"
        @click="value = ''"
      />
    </template>
  </UInput>
</template>
