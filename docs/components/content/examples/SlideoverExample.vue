<script setup>
const open = ref(false)
</script>

<template>
  <div>
    <UButton label="Open" @click="open = true" />

    <USlideover v-model="open">
      <div class="p-4 h-full">
        <Placeholder class="w-full h-full" />
      </div>
    </USlideover>
  </div>
</template>
