<script setup lang="ts">
import theme from '#build/ui/calendar'

const colors = Object.keys(theme.variants.color) as Array<keyof typeof theme.variants.color>
const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const value = ref<Date>(new Date())
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-center gap-2">
      <UCalendar v-model="value" />
    </div>
    <div class="flex items-center gap-2">
      <UCalendar
        v-for="color in colors"
        :key="color"
        v-model="value"
        :color="color"
      />
    </div>
    <div class="flex items-center gap-2">
      <UCalendar
        v-for="size in sizes"
        :key="size"
        v-model="value"
        :size="size"
      />
    </div>
  </div>
</template>
