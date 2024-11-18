<script setup lang="ts">
const minDate = ref(new Date('2023-09-01'))
const maxDate = ref(new Date('2023-09-30'))
const modelValue = ref({
  start: new Date('2023-09-01'),
  end: new Date('2023-09-07')
})
</script>

<template>
  <UCalendar v-model="modelValue" :min-value="minDate" :max-value="maxDate" range />
</template>
