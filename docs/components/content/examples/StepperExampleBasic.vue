<script setup>
const items = [{
  label: 'Step1'
}, {
  label: 'Step2',
  disabled: true
}, {
  label: 'Step3'
}]
</script>

<template>
  <UStepper :items="items" />
</template>