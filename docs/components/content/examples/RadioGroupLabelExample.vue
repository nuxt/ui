<script setup lang="ts">
const options = [
  { value: 'email', label: 'Email', icon: 'i-heroicons-at-symbol' },
  { value: 'sms', label: 'Phone (SMS)', icon: 'i-heroicons-phone' },
  { value: 'push', label: 'Push notification', icon: 'i-heroicons-bell' }
]

const selected = ref('sms')
</script>

<template>
  <URadioGroup v-model="selected" :options="options">
    <template #label="{ option }">
      <p class="italic">
        <UIcon :name="option.icon" />
        {{ option.label }}
      </p>
    </template>
  </URadioGroup>
</template>
