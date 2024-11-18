<script setup lang="ts">
const value = ref(1500)
</script>

<template>
  <UInputNumber
    v-model="value"
    :format-options="{
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
      currencySign: 'accounting'
    }"
  />
</template>
