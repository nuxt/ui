<script setup lang="ts">
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 60 }, (_, i) => 1980 + i)

const month = ref('June')
const day = ref(15)
const year = ref(2000)

const date = computed(() => `${month.value} ${day.value}, ${year.value}`)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <UWheelPickerGroup>
      <UWheelPicker v-model="month" :items="months" class="w-32" aria-label="Month" />
      <UWheelPicker v-model="day" :items="days" class="w-16" aria-label="Day" loop />
      <UWheelPicker v-model="year" :items="years" class="w-20" aria-label="Year" />
    </UWheelPickerGroup>

    <p class="text-sm text-muted">
      {{ date }}
    </p>
  </div>
</template>
