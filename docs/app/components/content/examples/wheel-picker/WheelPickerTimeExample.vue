<script setup lang="ts">
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const periods = ['AM', 'PM']

const hour = ref('09')
const minute = ref('30')
const period = ref('AM')

const time = computed(() => `${hour.value}:${minute.value} ${period.value}`)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <UWheelPickerGroup color="primary">
      <UWheelPicker v-model="hour" :items="hours" class="w-16" aria-label="Hour" loop />
      <UWheelPicker v-model="minute" :items="minutes" class="w-16" aria-label="Minute" loop />
      <UWheelPicker v-model="period" :items="periods" class="w-16" aria-label="Period" />
    </UWheelPickerGroup>

    <p class="text-sm text-muted">
      {{ time }}
    </p>
  </div>
</template>
