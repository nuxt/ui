<script setup lang="ts">
import theme from '#build/ui/checkbox'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)
const indicators = Object.keys(theme.variants.indicator)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size],
  indicator: [theme.defaultVariants.indicator]
})

const value = ref(true)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.indicator" :items="indicators" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UCheckbox v-model="value" label="Model value" v-bind="props" />
    <UCheckbox label="Default value" v-bind="props" :default-value="true" />
    <UCheckbox label="Indeterminate" v-bind="props" default-value="indeterminate" />
    <UCheckbox label="Icon" icon="i-lucide-heart" v-bind="props" :model-value="true" />
    <UCheckbox label="Required" v-bind="props" required />
    <UCheckbox label="Disabled" v-bind="props" disabled />
    <UCheckbox label="Description" description="This is a description" v-bind="props" />
  </Matrix>
</template>
