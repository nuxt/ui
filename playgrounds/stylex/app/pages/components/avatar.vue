<script setup lang="ts">
import theme from '#build/ui/avatar'

const sizes = Object.keys(theme.variants.size)
const colors = Object.keys(theme.variants.color)

const attrs = reactive({
  size: [theme.defaultVariants.size],
  color: [theme.defaultVariants.color]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.color" :items="colors" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" v-bind="props" />
    <UAvatar icon="i-lucide-image" v-bind="props" />
    <UAvatar alt="Benjamin Canac" v-bind="props" />
    <UAvatar :text="props?.size" v-bind="props" />

    <UAvatarGroup v-bind="props" :max="2">
      <UChip inset text="1">
        <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
      </UChip>
      <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
      <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
    </UAvatarGroup>

    <UAvatarGroup v-bind="props" :max="4">
      <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
      <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
      <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
    </UAvatarGroup>
  </Matrix>
</template>
