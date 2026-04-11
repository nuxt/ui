<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date'

const df = new DateFormatter('en-US', { dateStyle: 'medium' })
const tz = getLocalTimeZone()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual('sm')

const ranges = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 3 months', months: 3 },
  { label: 'Last 6 months', months: 6 },
  { label: 'Last year', years: 1 }
]

const initialEnd = today(tz)
const modelValue = shallowRef({
  start: initialEnd.subtract({ days: 14 }),
  end: initialEnd
})

const label = computed(() => {
  const { start, end } = modelValue.value
  if (!start) return 'Pick a date'
  if (!end) return df.format(start.toDate(tz))
  return `${df.format(start.toDate(tz))} - ${df.format(end.toDate(tz))}`
})

function computeStart(range: typeof ranges[number]) {
  const end = today(tz)
  return { start: end.subtract({ days: range.days, months: range.months, years: range.years }), end }
}

function isRangeSelected(range: typeof ranges[number]) {
  if (!modelValue.value?.start || !modelValue.value?.end) return false
  const { start, end } = computeStart(range)
  return modelValue.value.start.compare(start) === 0 && modelValue.value.end.compare(end) === 0
}

function selectRange(range: typeof ranges[number]) {
  modelValue.value = computeStart(range)
}
</script>

<template>
  <UPopover :content="{ align: 'center' }">
    <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
      {{ label }}
    </UButton>

    <template #content>
      <div class="flex items-stretch divide-x divide-(--ui-border)">
        <div class="hidden sm:flex flex-col justify-center py-2">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="neutral"
            variant="ghost"
            class="rounded-none px-4"
            :class="[isRangeSelected(range) ? 'bg-elevated' : 'hover:bg-elevated/50']"
            truncate
            @click="selectRange(range)"
          />
        </div>

        <UCalendar v-model="modelValue" class="p-2" :number-of-months="isDesktop ? 2 : 1" range />
      </div>
    </template>
  </UPopover>
</template>
