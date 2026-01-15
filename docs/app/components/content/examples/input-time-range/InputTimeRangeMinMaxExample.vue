<script setup lang="ts">
import { Time } from '@internationalized/date'

const timeRange = shallowRef({
  start: new Time(9, 0, 0),
  end: new Time(17, 0, 0)
})
const minValue = new Time(8, 0, 0)
const maxValue = new Time(20, 0, 0)
</script>

<template>
  <UInputTimeRange
    v-model="timeRange"
    :min-value="minValue"
    :max-value="maxValue"
  />
</template>
