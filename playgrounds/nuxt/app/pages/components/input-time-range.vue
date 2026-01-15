<script setup lang="ts">
import { Time } from '@internationalized/date'
import theme from '#build/ui/input-time-range'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const value = shallowRef({ start: new Time(9, 0), end: new Time(17, 30) })
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputTimeRange v-model="value" autofocus v-bind="props" />
    <UInputTimeRange
      :default-value="{ start: new Time(9, 0), end: new Time(17, 30) }"
      v-bind="props"
    />
    <UInputTimeRange highlight v-bind="props" />
    <UInputTimeRange disabled v-bind="props" />
    <UInputTimeRange required v-bind="props" />
    <UInputTimeRange icon="i-lucide-clock" v-bind="props" />
    <UInputTimeRange icon="i-lucide-clock" trailing v-bind="props" />
    <UInputTimeRange
      :avatar="{ src: 'https://github.com/benjamincanac.png' }"
      icon="i-lucide-clock"
      trailing
      v-bind="props"
    />
    <UInputTimeRange loading v-bind="props" />
    <UInputTimeRange loading trailing v-bind="props" />
    <UInputTimeRange
      loading
      icon="i-lucide-clock"
      trailing-icon="i-lucide-chevron-down"
      v-bind="props"
    />
    <UInputTimeRange separator-icon="i-lucide-arrow-right" v-bind="props" />
    <UInputTimeRange :hour-cycle="24" v-bind="props" />
    <UInputTimeRange granularity="second" v-bind="props" />
  </Matrix>
</template>
