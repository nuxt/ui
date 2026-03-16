<script setup lang="ts">
import { Time } from '@internationalized/date'
import theme from '#build/ui/input-time'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant],
})

const value = shallowRef(new Time(12, 30))
const rangeValue = shallowRef({ start: new Time(9, 0), end: new Time(17, 30) })
const rangeMode = ref(false)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="rangeMode" :items="[false, true]" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputTime :model-value="rangeMode ? rangeValue : value" @update:model-value="Array.isArray($event) ? (rangeValue = $event) : (value = $event)" :range="rangeMode" autofocus v-bind="props" />
    <UInputTime :default-value="new Time(12, 30)" :range="rangeMode" v-bind="props" />
    <UInputTime highlight :range="rangeMode" v-bind="props" />
    <UInputTime disabled :range="rangeMode" v-bind="props" />
    <UInputTime required :range="rangeMode" v-bind="props" />
    <UInputTime icon="i-lucide-clock" :range="rangeMode" v-bind="props" />
    <UInputTime icon="i-lucide-clock" trailing :range="rangeMode" v-bind="props" />
    <UInputTime :avatar="{ src: 'https://github.com/benjamincanac.png' }" icon="i-lucide-clock" trailing :range="rangeMode" v-bind="props" />
    <UInputTime loading :range="rangeMode" v-bind="props" />
    <UInputTime loading trailing :range="rangeMode" v-bind="props" />
    <UInputTime loading icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" :range="rangeMode" v-bind="props" />
  </Matrix>
</template>
