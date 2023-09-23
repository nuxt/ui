<script setup>
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
  <div class="space-y-1">
    <URadioGroup v-model="selected" :options="options" />
  </div>
</template>
