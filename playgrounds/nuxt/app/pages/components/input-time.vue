<script setup lang="ts">
import theme from '#build/ui/input-time'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const value = shallowRef(new Temporal.PlainTime(12, 30))
const range = shallowRef({
  start: new Temporal.PlainTime(8, 0),
  end: new Temporal.PlainTime(16, 30)
})
const defaultValue = new Temporal.PlainTime(12, 30)
const defaultRange = {
  start: new Temporal.PlainTime(8, 0),
  end: new Temporal.PlainTime(16, 30)
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputTime v-model="value" autofocus v-bind="props" />
    <UInputTime :default-value="defaultValue" v-bind="props" />
    <UInputTime v-model="range" range v-bind="props" />
    <UInputTime :default-value="defaultRange" range v-bind="props" />
    <UInputTime highlight v-bind="props" />
    <UInputTime disabled v-bind="props" />
    <UInputTime required v-bind="props" />
    <UInputTime :hour-cycle="24" v-bind="props" />
    <UInputTime icon="i-lucide-clock" v-bind="props" />
    <UInputTime icon="i-lucide-clock" trailing v-bind="props" />
    <UInputTime :avatar="{ src: 'https://github.com/benjamincanac.png' }" icon="i-lucide-clock" trailing v-bind="props" />
    <UInputTime loading v-bind="props" />
    <UInputTime loading trailing v-bind="props" />
    <UInputTime loading icon="i-lucide-clock" trailing-icon="i-lucide-chevron-down" v-bind="props" />
  </Matrix>
</template>
