<script setup lang="ts">
const email = ref('')
</script>

<template>
  <UFormField label="Email" help="We won't share your email." required>
    <UInput v-model="email" placeholder="Enter your email" icon="i-lucide-at-sign" />
  </UFormField>
</template>
