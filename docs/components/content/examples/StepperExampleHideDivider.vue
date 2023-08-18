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
  <UStepper :items="items" :display-divider="false" />
</template>