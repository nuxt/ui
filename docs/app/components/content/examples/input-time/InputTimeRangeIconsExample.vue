<script setup lang="ts">
import { Time } from '@internationalized/date'

const start = shallowRef(new Time(8, 0, 0))
const end = shallowRef(new Time(14, 30, 0))

const rangeValue = computed({
  get: () => ({ start: start.value, end: end.value }),
  set: (value) => {
    start.value = value.start
    end.value = value.end
  }
})
</script>

<template>
  <UInputTime
    v-model="rangeValue"
    range
    leading-icon="i-lucide-sunrise"
    trailing-icon="i-lucide-sunset"
    color="primary"
    variant="soft"
  />
</template>
