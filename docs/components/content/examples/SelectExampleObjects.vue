<script setup lang="ts">
const countries = [{
  name: 'United States',
  value: 'US'
}, {
  name: 'Canada',
  value: 'CA',
  disabled: true
}, {
  name: 'Mexico',
  value: 'MX'
}]

const country = ref('CA')
</script>

<template>
  <USelect v-model="country" :options="countries" option-attribute="name" />
</template>
