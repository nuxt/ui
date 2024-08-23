<script setup lang="ts">
const first = ref(false)
const second = ref(false)
</script>

<template>
  <UModal v-model:open="first" title="First modal" :ui="{ footer: 'justify-end' }">
    <UButton color="gray" variant="subtle" label="Open" />

    <template #footer>
      <UButton label="Close" color="gray" variant="outline" @click="first = false" />

      <UModal v-model:open="second" title="Second modal" :ui="{ footer: 'justify-end' }">
        <UButton label="Open second" color="gray" />

        <template #footer>
          <UButton label="Close" color="gray" variant="outline" @click="second = false" />
        </template>
      </UModal>
    </template>
  </UModal>
</template>
