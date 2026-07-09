<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'

const modelValue = shallowRef(today(getLocalTimeZone()))
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <UCalendar v-model="modelValue" :week-starts-on="1" />
  </div>
</template>
