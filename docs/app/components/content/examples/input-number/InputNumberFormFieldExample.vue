<script setup lang="ts">
const retries = ref(0)
</script>

<template>
  <UFormField label="Retries" help="Specify number of attempts" required>
    <UInputNumber v-model="retries" placeholder="Enter retries" />
  </UFormField>
</template>
