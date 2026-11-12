<script setup lang="ts">
const modelValue = shallowRef(new Temporal.PlainDate(2023, 9, 10))
const minDate = new Temporal.PlainDate(2023, 9, 1)
const maxDate = new Temporal.PlainDate(2023, 9, 30)
</script>

<template>
  <UInputDate v-model="modelValue" :min-value="minDate" :max-value="maxDate" />
</template>
