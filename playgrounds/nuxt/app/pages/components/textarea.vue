<script setup lang="ts">
import theme from '#build/ui/textarea'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  variant: [theme.defaultVariants.variant],
  size: [theme.defaultVariants.size]
})

const value = ref('Value')
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" placeholder="Color" multiple />
    <USelect v-model="attrs.variant" :items="variants" placeholder="Variant" multiple />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UTextarea v-model="value" autofocus v-bind="props" />
    <UTextarea :default-value="'Default value'" v-bind="props" />
    <UTextarea placeholder="Highlight" highlight v-bind="props" />
    <UTextarea disabled placeholder="Disabled" v-bind="props" />
    <UTextarea required placeholder="Required" v-bind="props" />
    <UTextarea icon="i-lucide-search" placeholder="Search..." :rows="1" v-bind="props" />
    <UTextarea icon="i-lucide-search" trailing placeholder="Search..." :rows="1" v-bind="props" />
    <UTextarea
      :avatar="{ src: 'https://github.com/benjamincanac.png' }"
      icon="i-lucide-search"
      trailing
      placeholder="Search..."
      :rows="1"
      v-bind="props"
    />
    <UTextarea loading placeholder="Loading..." :rows="1" v-bind="props" />
    <UTextarea loading trailing placeholder="Loading..." :rows="1" v-bind="props" />
    <UTextarea
      loading
      icon="i-lucide-search"
      trailing-icon="i-lucide-chevron-down"
      placeholder="Loading..."
      :rows="1"
      v-bind="props"
    />
    <UTextarea placeholder="Autoresize" autoresize :maxrows="5" :rows="1" v-bind="props" />
  </Matrix>
</template>
