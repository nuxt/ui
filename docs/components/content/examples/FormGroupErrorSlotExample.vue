<template>
  <UFormGroup label="Email" :error="!email && 'You must enter an email'" help="This is a nice email!">
    <template #default="{ error }">
      <UInput v-model="email" type="email" placeholder="Enter email" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
    </template>

    <template #error="{ error }">
      <span :class="[error ? 'text-red-500 dark:text-red-400' : 'text-primary-500 dark:text-primary-400']">
        {{ error ? error : 'Your email is valid' }}
      </span>
    </template>
  </UFormGroup>
</template>

<script setup lang="ts">
const email = ref('')
</script>
