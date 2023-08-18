<script setup>
const items = [{
  label: 'Step1'
}, {
  label: 'Step2'
}, {
  label: 'Step3'
}]
</script>

<template>
  <UStepper
    :items="items"
    completed-icon="i-heroicons-check-circle"
    active-icon="i-heroicons-stop-circle-solid"
    pending-icon="i-heroicons-information-circle"
  />
</template>
