<script setup lang="ts">
const first = ref(false)
const second = ref(false)
</script>

<template>
  <UDrawer v-model:open="first" title="First drawer" description="Opening another drawer stacks it on top of this one." :ui="{ container: 'max-w-xl mx-auto' }">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />

    <template #body>
      <Placeholder class="h-48" />
    </template>

    <template #footer>
      <UDrawer v-model:open="second" title="Second drawer" description="The first drawer stays open behind it." :ui="{ container: 'max-w-xl mx-auto' }">
        <UButton label="Open second" color="neutral" class="justify-center" />

        <template #body>
          <Placeholder class="h-32" />
        </template>

        <template #footer>
          <UButton label="Close" color="neutral" variant="outline" class="justify-center" @click="second = false" />
        </template>
      </UDrawer>

      <UButton label="Close" color="neutral" variant="outline" class="justify-center" @click="first = false" />
    </template>
  </UDrawer>
</template>
