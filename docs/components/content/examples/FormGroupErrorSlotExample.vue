<template>
  <UFormGroup label="Email" :error="!email && 'You must enter an email'" help="This is a nice email!">
    <template #default="{ error }">
      <UInput v-model="email" type="email" placeholder="Enter email" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
    </template>
    <template #error="{ error }">
      <UAlert icon="i-heroicons-exclamation-triangle-20-solid" :description="error" color="red" />
    </template>
  </UFormGroup>
</template>

<script setup lang="ts">
const email = ref('')
</script>
