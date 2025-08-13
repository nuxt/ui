<script lang="ts" setup>
import theme from '#build/ui/button'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const colors = Object.keys(theme.variants.color) as Array<keyof typeof theme.variants.color>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const state = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="size in sizes"
        :key="size"
        v-model="state"
        icon="i-lucide-x"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="size in sizes"
        :key="size"
        v-model="state"
        label="toggle"
        icon="i-lucide-x"
        :size="size"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="color in colors"
        :key="color"
        v-model="state"
        icon="i-lucide-x"
        :color="color"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="color in colors"
        :key="color"
        v-model="state"
        icon="i-lucide-x"
        :active-color="color"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="variant in variants"
        :key="variant"
        v-model="state"
        icon="i-lucide-x"
        :variant="variant"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="variant in variants"
        :key="variant"
        v-model="state"
        icon="i-lucide-x"
        :active-variant="variant"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="size in sizes"
        :key="size"
        v-model="state"
        icon="i-lucide-x"
        :size="size"
        class="rounded-none"
      />
    </div>
    <div class="flex items-center gap-1.5">
      <UToggle
        v-for="size in sizes"
        :key="size"
        v-model="state"
        icon="i-lucide-x"
        :size="size"
        :ui="{ base: 'rounded-none' }"
      />
    </div>
  </div>
</template>
