<script setup lang="ts">
const time = shallowRef(new Temporal.PlainTime(12, 30))
</script>

<template>
  <UFormField label="Time" help="Specify the time" required>
    <UInputTime v-model="time" />
  </UFormField>
</template>
