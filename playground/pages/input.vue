<script setup lang="ts">
import theme from '#build/ui/input'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 ml-[46px]">
      <UInput placeholder="Search..." autofocus />
      <UInput placeholder="Search..." color="gray" />
      <UInput placeholder="Search..." color="primary" />
      <UInput placeholder="Search..." disabled />
      <UInput file="i-heroicons-calculator" type="number" :model-value="10" />
      <UInput icon="i-heroicons-folder" type="file" />
      <UInput icon="i-heroicons-calendar" type="date" :model-value="new Date().toISOString().substring(0, 10)" />
      <UInput icon="i-heroicons-lock-closed" type="password" model-value="password" />
      <UInput loading placeholder="Search..." />
      <UInput loading leading-icon="i-heroicons-magnifying-glass" placeholder="Search..." />
      <UInput loading trailing placeholder="Search..." />
      <UInput loading trailing-icon="i-heroicons-magnifying-glass" placeholder="Search..." />
    </div>
    <div class="flex items-center gap-4 ml-[-44px]">
      <UInput
        v-for="size in sizes"
        :key="size"
        placeholder="Search..."
        :size="(size as any)"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search..."
        :size="(size as any)"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        :avatar="{ src: 'https://avatars.githubusercontent.com/u/739984?v=4' }"
        placeholder="Search..."
        :size="(size as any)"
      />
    </div>
    <div class="flex items-center gap-4">
      <UInput
        v-for="size in sizes"
        :key="size"
        icon="i-heroicons-magnifying-glass"
        trailing
        placeholder="Search..."
        :size="(size as any)"
      />
    </div>
  </div>
</template>
