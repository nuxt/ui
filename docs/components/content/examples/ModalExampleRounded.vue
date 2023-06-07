<script setup>
const isOpen = ref(false)
const rounded = ref('lg');
const roundedOptions = [ 'none','sm','rounded','md','lg','xl','2xl','3xl','full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded">
      <USelect v-model="rounded" :options="roundedOptions"  />
    </UFormGroup>

    <UButton label="Open" @click="isOpen = true" class="mt-4" />

    <UModal v-model="isOpen" :rounded="rounded">
      <div class="p-4">
        <Placeholder class="h-48" />
      </div>
    </UModal>
  </div>
</template>
