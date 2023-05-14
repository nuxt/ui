<script setup>
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <USlideover v-model="isOpen">
      <div class="p-4 h-full">
        <Placeholder class="w-full h-full" />
      </div>
    </USlideover>
  </div>
</template>
