<script setup lang="ts">
const singleValue = ref(new Date('2023-09-01'))
const multipleValue = ref({
  start: new Date('2023-09-01'),
  end: new Date('2023-09-07')
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="singleValue" />
    </div>
    <div class="flex justify-center gap-2">
      <UCalendar v-model="multipleValue" range />
    </div>
  </div>
</template>
