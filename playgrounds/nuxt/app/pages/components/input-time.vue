<script setup lang="ts">
import { reactive, ref, shallowRef } from 'vue'
import { Time } from '@internationalized/date'
import theme from '#build/ui/input-time'
import type { TimeValue } from 'reka-ui'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

interface PlaygroundTimeRange {
  start: TimeValue | undefined
  end: TimeValue | undefined
}

function createRangeValue(startHour: number, startMinute: number, endHour: number, endMinute: number): PlaygroundTimeRange {
  return {
    start: new Time(startHour, startMinute) as TimeValue,
    end: new Time(endHour, endMinute) as TimeValue
  }
}

const singleValue = shallowRef<TimeValue>(new Time(12, 30) as TimeValue)
const rangeValue = shallowRef<PlaygroundTimeRange>(createRangeValue(9, 0, 17, 30))
const rangeMode = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USwitch v-model="rangeMode">
      <template #label>
        Range
      </template>
    </USwitch>
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputTime v-if="rangeMode" v-model="rangeValue" range autofocus v-bind="props" />
    <UInputTime v-else v-model="singleValue" autofocus v-bind="props" />
    <UInputTime :default-value="rangeMode ? { start: new Time(8, 0) as TimeValue, end: new Time(16, 30) as TimeValue } : new Time(12, 30) as TimeValue" :range="rangeMode" v-bind="props" />
    <UInputTime highlight :range="rangeMode" v-bind="props" />
    <UInputTime disabled :range="rangeMode" v-bind="props" />
    <UInputTime required :range="rangeMode" v-bind="props" />
    <UInputTime :hour-cycle="24" :range="rangeMode" v-bind="props" />
    <UInputTime icon="i-lucide-clock" :range="rangeMode" v-bind="props" />
    <UInputTime icon="i-lucide-clock" trailing :range="rangeMode" v-bind="props" />
    <UInputTime :avatar="{ src: 'https://github.com/benjamincanac.png' }" icon="i-lucide-clock" trailing :range="rangeMode" v-bind="props" />
    <UInputTime loading :range="rangeMode" v-bind="props" />
    <UInputTime loading trailing :range="rangeMode" v-bind="props" />
    <UInputTime loading icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" :range="rangeMode" v-bind="props" />
  </Matrix>
</template>
