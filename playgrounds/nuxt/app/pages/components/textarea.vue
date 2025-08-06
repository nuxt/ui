<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/textarea'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UTextarea autofocus placeholder="Search..." />
    </div>
    <div class="flex items-center gap-2">
      <UTextarea v-for="variant in variants" :key="variant" :placeholder="upperFirst(variant)" :variant="variant" class="w-48" />
    </div>
    <div class="flex items-center gap-2">
      <UTextarea
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="neutral"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UTextarea
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
      <UTextarea placeholder="Disabled" disabled />
      <UTextarea placeholder="Required" required />
      <UTextarea icon="i-lucide-text-cursor" placeholder="Autoresize" autoresize :maxrows="5" :rows="1" />
      <UTextarea icon="i-lucide-search" placeholder="Search..." :rows="1" />
      <UTextarea loading placeholder="Search..." :rows="1" />
      <UTextarea loading trailing placeholder="Search..." :rows="1" />
      <UTextarea loading icon="i-lucide-search" trailing-icon="i-lucide-chevron-down" placeholder="Search..." :rows="1" />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea
        v-for="size in sizes"
        :key="size"
        placeholder="Search..."
        :size="size"
        :rows="1"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-search"
        placeholder="Search..."
        :size="size"
        :rows="1"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-search"
        trailing
        placeholder="Search..."
        :size="size"
        :rows="1"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UTextarea
        v-for="size in sizes"
        :key="size"
        :avatar="{ src: 'https://github.com/benjamincanac.png' }"
        icon="i-lucide-search"
        trailing
        placeholder="Search..."
        :size="size"
        :rows="1"
        class="w-48"
      />
    </div>
  </div>
</template>
