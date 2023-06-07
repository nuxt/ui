<script setup>
const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <UTooltip text="Tooltip example" :shortcuts="['⌘', 'O']" :rounded="rounded">
      <UButton color="gray" label="Hover me" />
    </UTooltip>
  </div>
</template>
