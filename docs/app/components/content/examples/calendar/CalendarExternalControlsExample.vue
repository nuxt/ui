<script setup lang="ts">
const date = shallowRef(new Temporal.PlainDate(2025, 4, 2))
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCalendar v-model="date" :month-controls="false" :year-controls="false" />

    <div class="flex justify-between gap-4">
      <UButton color="neutral" variant="outline" @click="date = date.subtract({ months: 1 })">
        Prev
      </UButton>

      <UButton color="neutral" variant="outline" @click="date = date.add({ months: 1 })">
        Next
      </UButton>
    </div>
  </div>
</template>
