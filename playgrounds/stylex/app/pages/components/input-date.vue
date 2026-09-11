<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import theme from '#build/ui/input-date'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const value = shallowRef(new CalendarDate(2022, 1, 10))
const range = shallowRef({
  start: new CalendarDate(2022, 1, 10),
  end: new CalendarDate(2022, 1, 20)
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputDate v-model="value" autofocus v-bind="props" />
    <UInputDate :default-value="new CalendarDate(2022, 1, 10)" v-bind="props" />
    <UInputDate v-model="range" range v-bind="props" />
    <UInputDate :default-value="{ start: new CalendarDate(2022, 1, 10), end: new CalendarDate(2022, 1, 20) }" range v-bind="props" />
    <UInputDate highlight v-bind="props" />
    <UInputDate disabled v-bind="props" />
    <UInputDate required v-bind="props" />
    <UInputDate icon="i-lucide-clock" v-bind="props" />
    <UInputDate icon="i-lucide-clock" trailing v-bind="props" />
    <UInputDate :avatar="{ src: 'https://github.com/benjamincanac.png' }" icon="i-lucide-clock" trailing v-bind="props" />
    <UInputDate loading v-bind="props" />
    <UInputDate loading trailing v-bind="props" />
    <UInputDate loading icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" v-bind="props" />
  </Matrix>
</template>
