<script setup lang="ts">
import { Time } from '@internationalized/date'

const timeRange = shallowRef({
  start: new Time(9, 0, 0),
  end: new Time(17, 30, 0)
})
</script>

<template>
  <UFormField
    label="Working hours"
    help="Specify the working hours range"
    required
  >
    <UInputTimeRange v-model="timeRange" />
  </UFormField>
</template>
