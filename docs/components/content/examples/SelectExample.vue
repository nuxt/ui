<script setup>
const countries = ['United States', 'Canada', 'Mexico']

const country = ref(countries[0])
</script>

<template>
  <USelect v-model="country" :options="countries" />
</template>
