<script setup lang="ts">
const date = shallowRef(Temporal.Now.plainDateISO())

function selectToday() {
  date.value = Temporal.Now.plainDateISO()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UCalendar v-model="date" />

    <UButton color="neutral" variant="outline" class="justify-center" @click="selectToday">
      Today
    </UButton>
  </div>
</template>
