<script setup>
const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <UPopover :rounded="rounded">
      <UButton color="white" label="Open" trailing-icon="i-heroicons-chevron-down-20-solid" />

      <template #panel>
        <div class="p-4">
          <Placeholder class="h-20 w-48" />
        </div>
      </template>
    </UPopover>
  </div>
</template>
