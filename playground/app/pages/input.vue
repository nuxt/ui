<script setup lang="ts">
import theme from '#build/ui/input'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 w-60">
      <UInput autofocus />
      <UInput placeholder="Search..." color="gray" />
      <UInput placeholder="Search..." color="primary" />
      <UInput placeholder="Search..." variant="none" />
      <UInput placeholder="Disabled" disabled />
      <UInput placeholder="Required" required />
      <UInput file="i-heroicons-calculator" type="number" :model-value="10" />
      <UInput icon="i-heroicons-folder" type="file" />
      <UInput icon="i-heroicons-calendar" type="date" :model-value="new Date().toISOString().substring(0, 10)" />
      <UInput icon="i-heroicons-lock-closed" type="password" model-value="password" />
      <UInput loading placeholder="Search..." />
      <UInput loading trailing placeholder="Search..." />
      <UInput loading icon="i-heroicons-magnifying-glass" trailing-icon="i-heroicons-chevron-down" placeholder="Search..." />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        placeholder="Search..."
        :size="size"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
        :size="size"
        class="w-60"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-magnifying-glass"
        trailing
        placeholder="Search..."
        :size="size"
        class="w-60"
      />
    </div>
  </div>
</template>
