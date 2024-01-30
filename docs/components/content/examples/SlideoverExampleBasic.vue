<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <USlideover v-model="isOpen">
      <div class="p-4 flex-1">
        <Placeholder class="h-full" />
      </div>
    </USlideover>
  </div>
</template>
