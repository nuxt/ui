<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import theme from '#build/ui/calendar'

const singleValue = shallowRef(new CalendarDate(2022, 1, 10))
const multipleValue = shallowRef([new CalendarDate(2022, 1, 10), new CalendarDate(2022, 1, 20)])
const rangeValue = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
const monthValue = shallowRef(new CalendarDate(2022, 6, 1))
const monthRangeValue = shallowRef({
  start: new CalendarDate(2022, 2, 1),
  end: new CalendarDate(2022, 6, 1)
})
const yearValue = shallowRef(new CalendarDate(2022, 1, 1))
const yearRangeValue = shallowRef({
  start: new CalendarDate(2020, 1, 1),
  end: new CalendarDate(2023, 1, 1)
})

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)
const types = ['date', 'month', 'year']

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size],
  type: ['date'] as ('date' | 'month' | 'year')[]
})

const multiple = ref(false)
const range = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.type" :items="types" multiple />
    <USwitch v-model="multiple" label="Multiple" />
    <USwitch v-model="range" label="Range" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UCalendar v-if="props?.type === 'month' && range" v-model="monthRangeValue" range v-bind="props" />
    <UCalendar v-else-if="props?.type === 'month'" v-model="monthValue" v-bind="props" />
    <UCalendar v-else-if="props?.type === 'year' && range" v-model="yearRangeValue" range v-bind="props" />
    <UCalendar v-else-if="props?.type === 'year'" v-model="yearValue" v-bind="props" />
    <UCalendar v-else-if="range" v-model="rangeValue" range v-bind="props" />
    <UCalendar v-else-if="multiple" v-model="multipleValue" multiple v-bind="props" />
    <UCalendar v-else v-model="singleValue" v-bind="props" />
  </Matrix>
</template>
