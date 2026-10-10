<script setup lang="ts">
import { onMounted, ref } from 'vue'
import theme from '#build/ui/progress'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const animations = Object.keys(theme.variants.animation)
const orientations = Object.keys(theme.variants.orientation)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  animation: [theme.defaultVariants.animation]
})

const orientation = ref('horizontal' as keyof typeof theme.variants.orientation)
const variant = ref('linear' as keyof typeof theme.variants.variant)

const value1 = ref(0)
const value2 = ref(0)
const max = ['Waiting...', 'Cloning...', 'Migrating...', 'Deploying...', 'Done!']

onMounted(() => {
  setInterval(() => {
    if (value1.value === 100) {
      value1.value = 0
      return
    }

    value1.value += 25
  }, 1000)

  setInterval(() => {
    if (value2.value === 4) {
      value2.value = 0
      return
    }

    value2.value += 1
  }, 1000)
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.animation" :items="animations" multiple />
    <USelect v-model="orientation" :items="orientations" />
    <USelect v-model="variant" :items="variants" />
  </Navbar>

  <Matrix
    v-slot="props"
    :attrs="attrs"
    :container-props="{ 'data-orientation': orientation, 'data-variant': variant }"
    container-class="gap-4 data-[orientation=horizontal]:data-[variant=linear]:w-48 data-[orientation=vertical]:data-[variant=linear]:h-48 data-[orientation=vertical]:flex-row"
  >
    <UProgress :orientation="orientation" :variant="variant" v-bind="props" inverted />
    <UProgress
      v-model="value2"
      :max="max"
      status
      :orientation="orientation"
      :variant="variant"
      v-bind="props"
    />
    <UProgress
      v-model="value2"
      :max="max"
      status
      inverted
      :orientation="orientation"
      :variant="variant"
      v-bind="props"
    />
    <UProgress
      v-model="value2"
      :max="max"
      :thickness="5"
      :orientation="orientation"
      :variant="variant"
      v-bind="props"
    />
  </Matrix>
</template>
