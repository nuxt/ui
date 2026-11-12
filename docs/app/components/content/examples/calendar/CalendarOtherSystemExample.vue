<script lang="ts" setup>
const hebrewDate = shallowRef(Temporal.PlainDate.from({ calendar: 'hebrew', year: 5781, month: 1, day: 1 }))
</script>

<template>
  <UCalendar v-model="hebrewDate" />
</template>
