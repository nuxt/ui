<template>
  <UFormGroup label="Email" :error="!email && 'You must enter an email'" help="This is a nice email!">
    <template #default="{ error }">
      <UInput v-model="email" type="email" placeholder="Enter email" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
    </template>

    <template #error="{ error }">
      <UAlert v-if="error" icon="i-heroicons-exclamation-triangle-20-solid" :title="error" color="red" />
      <UAlert v-else icon="i-heroicons-check-circle-20-solid" title="Your email is valid" color="green" />
    </template>
  </UFormGroup>
</template>

<script setup lang="ts">
const email = ref('')
</script>
