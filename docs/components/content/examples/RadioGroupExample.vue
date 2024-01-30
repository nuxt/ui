<script setup lang="ts">
const options = [{
  value: 'email',
  label: 'Email'
}, {
  value: 'sms',
  label: 'Phone (SMS)'
}, {
  value: 'push',
  label: 'Push notification'
}]

const selected = ref('sms')
</script>

<template>
  <URadioGroup v-model="selected" legend="Choose something" :options="options" />
</template>
