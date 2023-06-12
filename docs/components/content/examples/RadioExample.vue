<script setup>
const methods = [{
  name: 'email',
  value: 'email',
  label: 'Email'
}, {
  name: 'sms',
  value: 'sms',
  label: 'Phone (SMS)'
}, {
  name: 'push',
  value: 'push',
  label: 'Push notification'
}]

const selected = ref('sms')
</script>

<template>
  <div class="space-y-1">
    <URadio v-for="method of methods" :key="method.name" v-model="selected" v-bind="method" />
  </div>
</template>
