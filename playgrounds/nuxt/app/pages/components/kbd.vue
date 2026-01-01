<script setup lang="ts">
import theme from '#build/ui/kbd'
import { kbdKeysMap } from '@nuxt/ui/composables/useKbd'

const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)
const colors = Object.keys(theme.variants.color)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const kbdKeys = Object.keys(kbdKeysMap)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UKbd v-for="(kdbKey, index) in kbdKeys" :key="index" :value="kdbKey" v-bind="props" />
  </Matrix>
</template>
