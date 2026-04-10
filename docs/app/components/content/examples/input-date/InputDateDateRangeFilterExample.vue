<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { today, getLocalTimeZone } from '@internationalized/date'
import type { DateRange } from 'reka-ui'

const tz = getLocalTimeZone()

const presets = [
  { label: '1D', days: 1 },
  { label: '3D', days: 3 },
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 }
]

const active = ref(7)
const isCustom = computed(() => !presets.some(p => p.days === active.value))

const dateRange = shallowRef<{ start: DateValue, end: DateValue }>({
  start: today(tz).subtract({ days: 7 }),
  end: today(tz)
})

function selectPreset(days: number) {
  active.value = days
  dateRange.value = { start: today(tz).subtract({ days }), end: today(tz) }
}

const open = ref(false)
function onCalendarUpdate(val: DateRange | null) {
  if (!val?.start || !val?.end) return
  dateRange.value = { start: val.start, end: val.end }
  active.value = -1
  open.value = false
}

const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const formattedRange = computed(() => {
  const { start, end } = dateRange.value
  return `${fmt.format(new Date(start.year, start.month - 1, start.day))} – ${fmt.format(new Date(end.year, end.month - 1, end.day))}`
})
</script>

<template>
  <div class="inline-flex items-center gap-1 bg-(--ui-bg-elevated) rounded-lg p-1">
    <UButton
      v-for="preset in presets"
      :key="preset.days"
      :label="preset.label"
      :color="active === preset.days ? 'primary' : 'neutral'"
      :variant="active === preset.days ? 'solid' : 'ghost'"
      size="xs"
      @click="selectPreset(preset.days)"
    />

    <span class="h-4 w-px bg-(--ui-border) mx-0.5 self-center" />

    <UPopover v-model:open="open">
      <UButton
        icon="i-lucide-calendar"
        :label="formattedRange"
        :color="isCustom ? 'primary' : 'neutral'"
        :variant="isCustom ? 'solid' : 'ghost'"
        size="xs"
      />

      <template #content>
        <UCalendar :model-value="dateRange" range :number-of-months="2" class="p-2" @update:model-value="onCalendarUpdate" />
      </template>
    </UPopover>
  </div>
</template>
