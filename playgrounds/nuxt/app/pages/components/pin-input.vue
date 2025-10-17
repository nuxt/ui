<script setup lang="ts">
import theme from '#build/ui/pin-input'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const onComplete = (e: string[]) => {
  console.log(e)
}
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UPinInput placeholder="○" autofocus v-bind="props" @complete="onComplete" />
    <UPinInput placeholder="○" highlight v-bind="props" />
    <UPinInput placeholder="○" disabled v-bind="props" />
    <UPinInput placeholder="○" required v-bind="props" />
  </Matrix>
</template>
