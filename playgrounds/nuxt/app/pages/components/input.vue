<script setup lang="ts">
import theme from '#build/ui/input'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const value = ref('Model value')
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInput v-model="value" autofocus v-bind="props" />
    <UInput :default-value="'Default value'" v-bind="props" />
    <UInput placeholder="Highlight" highlight v-bind="props" />
    <UInput placeholder="Disabled" disabled v-bind="props" />
    <UInput placeholder="Required" required v-bind="props" />
    <UInput placeholder="Search..." icon="i-lucide-search" v-bind="props" />
    <UInput placeholder="Search..." icon="i-lucide-search" trailing v-bind="props" />
    <UInput :avatar="{ src: 'https://github.com/benjamincanac.png' }" icon="i-lucide-search" placeholder="Search..." trailing v-bind="props" />
    <UInput placeholder="Loading..." loading v-bind="props" />
    <UInput placeholder="Loading..." loading trailing v-bind="props" />
    <UInput placeholder="Loading..." loading icon="i-lucide-search" trailing-icon="i-lucide-chevron-down" v-bind="props" />
    <UInput icon="i-lucide-calculator" type="number" :model-value="10" v-bind="props" />
    <UInput icon="i-lucide-folder" type="file" v-bind="props" />
    <UInput icon="i-lucide-calendar" type="date" :model-value="new Date().toISOString().substring(0, 10)" v-bind="props" />
    <UInput icon="i-lucide-lock" type="password" model-value="password" v-bind="props" />
  </Matrix>
</template>
