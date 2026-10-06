<script setup lang="ts">
import theme from '#build/ui/button'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

function onClick() {
  return new Promise<void>(res => setTimeout(res, 5000))
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UButton label="Button" v-bind="props" />
    <UButton label="Link" to="/" v-bind="props" />
    <UButton label="Disabled" disabled v-bind="props" />
    <UButton label="Disabled link" to="#" disabled v-bind="props" />
    <UButton label="Loading" loading v-bind="props" />
    <UButton label="Loading" loading trailing v-bind="props" />
    <UButton label="Loading auto" loading-auto v-bind="props" @click="onClick" />
    <UButton label="Icon" icon="i-lucide-rocket" v-bind="props" />
    <UButton label="Icon" icon="i-lucide-chevron-down" trailing v-bind="props" />
    <UButton label="Avatar" :avatar="{ src: 'https://github.com/benjamincanac.png' }" v-bind="props" />
    <UButton icon="i-lucide-rocket" v-bind="props" square />
    <UButton :avatar="{ src: 'https://github.com/benjamincanac.png' }" v-bind="props" square />
  </Matrix>
</template>
