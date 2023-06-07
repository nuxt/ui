<script setup>
const toast = useToast()
const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <UButton label="Show toast" @click="toast.add({ title: 'Hello world!' , rounded})" />
  </div>
</template>
