<script setup lang="ts">
import theme from '#build/ui/switch'

const sizes = Object.keys(theme.variants.size)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 ml-[-348px]">
      <USwitch label="Normal" />
      <USwitch label="Checked" :checked="true" />
      <USwitch label="Default checked" default-checked />
      <USwitch label="Required" required />
      <USwitch label="Disabled" disabled />
    </div>
    <div class="flex items-center gap-4 ml-[-150px]">
      <USwitch v-for="size in sizes" :key="size" :size="(size as any)" label="Switch me" />
    </div>
    <div class="flex items-center gap-4 ml-[-150px]">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="(size as any)"
        label="Switch me"
        unchecked-icon="i-heroicons-x-mark-20-solid"
        checked-icon="i-heroicons-check-20-solid"
      />
    </div>
    <div class="flex items-center gap-4 ml-[-150px]">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="(size as any)"
        label="Switch me"
        unchecked-icon="i-heroicons-x-mark-20-solid"
        checked-icon="i-heroicons-check-20-solid"
        loading
      />
    </div>
    <div class="flex items-center gap-4">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="(size as any)"
        label="Switch me"
        description="This is a description"
      />
    </div>
  </div>
</template>
