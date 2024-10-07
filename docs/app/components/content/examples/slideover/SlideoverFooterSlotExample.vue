<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <USlideover v-model:open="open" title="Slideover with footer" description="This is useful when you want a form in a Slideover." :ui="{ footer: 'justify-end' }">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
      <Placeholder class="h-full" />
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="open = false" />
      <UButton label="Submit" color="neutral" />
    </template>
  </USlideover>
</template>
