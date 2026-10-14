<script setup lang="ts">
const show = ref(false)
const password = ref('')
</script>

<template>
  <UInput
    v-model="password"
    placeholder="Password"
    :type="show ? 'text' : 'password'"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        :aria-pressed="show"
        aria-controls="password"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>

<style>
/* Hide the password reveal button in Edge */
::-ms-reveal {
    display: none;
}
</style>
