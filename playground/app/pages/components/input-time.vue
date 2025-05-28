<script setup lang="ts">
import { Time } from '@internationalized/date'
import theme from '#build/ui/input'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

// Default time values
const defaultTime = ref(new Time(10, 30))
const hourOnlyTime = ref(new Time(14, 0))
const secondsTime = ref(new Time(9, 45, 30))
const cycle24Time = ref(new Time(16, 30))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UInputTime v-model="defaultTime" autofocus />
    </div>

    <div class="flex items-center gap-2 flex-wrap justify-center">
      <UInputTime
        v-for="variant in variants"
        :key="variant"
        v-model="defaultTime"
        :variant="variant"
        class="w-48"
      />
    </div>

    <div class="flex items-center gap-2 flex-wrap justify-center">
      <UInputTime
        v-for="variant in variants"
        :key="variant"
        v-model="defaultTime"
        :variant="variant"
        color="error"
        highlight
        class="w-48"
      />
    </div>

    <div class="flex flex-col gap-4 w-48">
      <UInputTime v-model="defaultTime" disabled />
      <UInputTime v-model="defaultTime" required />
      <UInputTime v-model="defaultTime" readonly />
      <UInputTime v-model="hourOnlyTime" granularity="hour" />
      <UInputTime v-model="secondsTime" granularity="second" />
      <UInputTime v-model="cycle24Time" :hour-cycle="24" />
      <UInputTime v-model="defaultTime" loading />
      <UInputTime v-model="defaultTime" loading trailing />
      <UInputTime v-model="defaultTime" icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" />
    </div>

    <div class="flex flex-wrap gap-4 justify-center">
      <UInputTime v-for="size in sizes" :key="size" v-model="defaultTime" :size="size" class="w-48" />
    </div>
    <div class="flex flex-wrap gap-4 justify-center">
      <UInputTime
        v-for="size in sizes"
        :key="size"
        v-model="defaultTime"
        icon="i-lucide-clock"
        :size="size"
        class="w-48"
      />
    </div>
    <div class="flex flex-wrap gap-4 justify-center">
      <UInputTime
        v-for="size in sizes"
        :key="size"
        v-model="defaultTime"
        icon="i-lucide-clock"
        trailing
        :size="size"
        class="w-48"
      />
    </div>
  </div>
</template>
