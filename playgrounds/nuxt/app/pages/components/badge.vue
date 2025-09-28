<script setup lang="ts">
import theme from '#build/ui/badge'

const colors = Object.keys(theme.variants.color)
const variants = Object.keys(theme.variants.variant)
const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UBadge label="Badge" v-bind="props" />
    <UBadge icon="i-lucide-rocket" label="Icon" v-bind="props" />
    <UBadge :avatar="{ src: 'https://github.com/benjamincanac.png' }" label="Avatar" v-bind="props" />
    <UBadge icon="i-lucide-rocket" v-bind="props" />
    <UBadge :avatar="{ src: 'https://github.com/benjamincanac.png' }" v-bind="props" />
  </Matrix>
</template>
