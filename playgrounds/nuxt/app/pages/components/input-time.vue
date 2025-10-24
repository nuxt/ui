<script setup lang="ts">
import { Time } from '@internationalized/date'
import theme from '#build/ui/input-number'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const value = shallowRef(new Time(12, 30))
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputTime v-model="value" v-bind="props" />
    <UInputTime highlight v-bind="props" />
    <UInputTime disabled v-bind="props" />
    <UInputTime required v-bind="props" />
  </Matrix>
</template>
