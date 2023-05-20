<script setup>
const isOpen = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <USlideover v-model="isOpen">
      <div class="p-4 h-full relative">
        <div>
          <UButton class="absolute top-8 right-8 z-50" leading-icon="i-heroicons-x-mark-solid" @click="isOpen = false" />
        </div>
        <Placeholder class="w-full h-full" />
      </div>
    </USlideover>
  </div>
</template>
