<script setup lang="ts">
const show = ref(false)
const password = ref('password')
</script>

<template>
  <UInput
    v-model="password"
    placeholder="Password"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pr-0.5' }"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
        aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
