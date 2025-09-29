<script setup lang="ts">
import theme from '#build/ui/slider'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const orientations = Object.keys(theme.variants.orientation)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)

const value = ref(50)
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="orientation" :items="orientations" />
  </Navbar>

  <Matrix
    v-slot="props"
    :attrs="attrs"
    :container-props="{ 'data-orientation': orientation }"
    container-class="gap-8 data-[orientation=horizontal]:w-48 data-[orientation=vertical]:h-48 data-[orientation=vertical]:flex-row"
  >
    <USlider v-model="value" :orientation="orientation" v-bind="props" />
    <USlider :default-value="50" :orientation="orientation" v-bind="props" />
    <USlider inverted :orientation="orientation" v-bind="props" />
    <USlider disabled :orientation="orientation" v-bind="props" />
    <USlider
      :min="4"
      :max="12"
      :step="2"
      :model-value="6"
      :orientation="orientation"
      v-bind="props"
    />
    <USlider :default-value="[0, 20]" :orientation="orientation" v-bind="props" />
    <USlider :model-value="[0, 20]" :orientation="orientation" v-bind="props" />
    <USlider :model-value="[0, 20, 80]" :orientation="orientation" v-bind="props" />
    <USlider :model-value="[0, 80]" :min-steps-between-thumbs="20" :orientation="orientation" v-bind="props" />
  </Matrix>
</template>
