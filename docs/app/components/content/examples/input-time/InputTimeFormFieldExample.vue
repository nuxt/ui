<script setup lang="ts">
import { Time } from '@internationalized/date'

const time = shallowRef(new Time(12, 30, 0))
</script>

<template>
  <UFormField label="Time" help="Specify the time" required>
    <UInputTime v-model="time" />
  </UFormField>
</template>
