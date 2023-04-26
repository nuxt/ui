<script setup>
const open = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="open = true" />

    <UModal v-model="open">
      <template #header>
        <Placeholder class="h-8" />
      </template>

      <Placeholder class="h-32" />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UModal>
  </div>
</template>
