<script setup lang="ts">
import { upperFirst } from 'scule'
import theme from '#build/ui/input-tags'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const tags = ref(['Vue', 'Nuxt'])
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-48">
      <UInputTags
        v-model="tags"
        placeholder="Enter tags..."
        autofocus
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputTags
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputTags
        v-for="variant in variants"
        :key="variant"
        :placeholder="upperFirst(variant)"
        :variant="variant"
        color="neutral"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-2">
      <UInputTags
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
      <UInputTags placeholder="Disabled" disabled />
      <UInputTags placeholder="Required" required />
      <UInputTags loading placeholder="Loading..." />
      <UInputTags loading trailing placeholder="Loading..." />
    </div>
    <div class="flex items-center gap-4">
      <UInputTags
        v-for="size in sizes"
        :key="size"
        :size="size"
        :placeholder="upperFirst(size)"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputTags
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-search"
        placeholder="Search..."
        :size="size"
        class="w-48"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInputTags
        v-for="size in sizes"
        :key="size"
        icon="i-lucide-search"
        trailing
        placeholder="Search..."
        :size="size"
        class="w-48"
      />
    </div>
  </div>
</template>
