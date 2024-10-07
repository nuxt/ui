<script setup lang="ts">
const first = ref(false)
const second = ref(false)
</script>

<template>
  <USlideover v-model:open="first" title="First slideover" :ui="{ footer: 'justify-end' }">
    <UButton color="neutral" variant="subtle" label="Open" />

    <template #body>
      <Placeholder class="h-full" />
    </template>

    <template #footer>
      <UButton label="Close" color="neutral" variant="outline" @click="first = false" />

      <USlideover v-model:open="second" title="Second slideover" :ui="{ footer: 'justify-end' }">
        <UButton label="Open second" color="neutral" />

        <template #body>
          <Placeholder class="h-full" />
        </template>

        <template #footer>
          <UButton label="Close" color="neutral" variant="outline" @click="second = false" />
        </template>
      </USlideover>
    </template>
  </USlideover>
</template>
