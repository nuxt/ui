<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UInputNumber />
    </div>
    <div class="flex items-center gap-2">
      <UInputNumber
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputNumber
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="neutral"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputNumber
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="error"
        highlight
        class="w-48"
      />
    </div>
    <div class="flex flex-col gap-4 w-48">
      <UInputNumber placeholder="Disabled" disabled />
      <UInputNumber placeholder="Required" required />
    </div>
    <div class="flex items-center gap-4">
      <UInputNumber
        v-for="size in sizes"
        :key="size"
        :size="size"
        :placeholder="`Horizontal ${size}`"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputNumber
        v-for="size in sizes"
        :key="size"
        :size="size"
        class="w-48"
        :placeholder="`Vertical ${size}`"
        orientation="vertical"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/input-number'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
</script>
