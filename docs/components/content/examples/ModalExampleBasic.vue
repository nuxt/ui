<script setup>
const open = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="open = true" />

    <UModal v-model="open">
      <div class="p-4">
        <Placeholder class="h-48" />
      </div>
    </UModal>
  </div>
</template>
