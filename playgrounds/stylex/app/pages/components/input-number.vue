<script setup lang="ts">
import theme from '#build/ui/input-number'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)

const value = ref(50)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="orientation" :items="orientations" />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UInputNumber v-model="value" :orientation="orientation" v-bind="props" />
    <UInputNumber :default-value="75" :orientation="orientation" v-bind="props" />
    <UInputNumber placeholder="Highlight" highlight :orientation="orientation" v-bind="props" />
    <UInputNumber placeholder="Disabled" disabled :orientation="orientation" v-bind="props" />
    <UInputNumber placeholder="Required" required :orientation="orientation" v-bind="props" />
  </Matrix>
</template>
