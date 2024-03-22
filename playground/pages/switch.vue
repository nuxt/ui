<script setup lang="ts">
import theme from '#build/ui/switch'

const sizes = Object.keys(theme.variants.size)
const checked = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      <USwitch v-model:checked="checked" />
    </div>
    <div>
      <USwitch v-model:checked="checked" disabled />
    </div>
    <div class="flex items-center gap-2 ml-[-36px]">
      <USwitch v-for="size in sizes" :key="size" v-model:checked="checked" :size="(size as any)" />
    </div>
    <div class="flex items-center gap-2 ml-[-36px]">
      <USwitch
        v-for="size in sizes"
        :key="size"
        v-model:checked="checked"
        :size="(size as any)"
        unchecked-icon="i-heroicons-x-mark-20-solid"
        checked-icon="i-heroicons-check-20-solid"
      />
    </div>
  </div>
</template>
