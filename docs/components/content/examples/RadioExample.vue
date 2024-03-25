<script setup lang="ts">
const methods = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Phone (SMS)' },
  { value: 'push', label: 'Push notification' }
]

const selected = ref('sms')
</script>

<template>
  <div class="space-y-1">
    <URadio v-for="method of methods" :key="method.value" v-model="selected" v-bind="method" />
  </div>
</template>
