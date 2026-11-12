<script setup lang="ts">
// Pinned rather than today: the tile renders on the server too, and a live
// date risks a hydration mismatch across timezones. The dashboard view pins
// its dates the same way.
const modelValue = shallowRef(new Temporal.PlainDate(2026, 7, 6))
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <UCalendar v-model="modelValue" :week-starts-on="1" class="w-full" />
  </div>
</template>
