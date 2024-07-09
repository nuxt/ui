<script setup lang="ts">
import theme from '#build/ui/switch'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>

const checked = ref(true)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4 ml-[-114px]">
      <USwitch v-model="checked" label="Primary" />
      <USwitch color="gray" label="Gray" :default-value="true" />
      <USwitch color="error" label="Error" :default-value="true" />
      <USwitch label="Default value" :default-value="true" />
      <USwitch label="Required" required />
      <USwitch label="Disabled" disabled />
    </div>
    <div class="flex items-center gap-4 ml-[-82px]">
      <USwitch v-for="size in sizes" :key="size" :size="size" label="Switch me" />
    </div>
    <div class="flex items-center gap-4 ml-[-82px]">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="size"
        label="Switch me"
        unchecked-icon="i-heroicons-x-mark-20-solid"
        checked-icon="i-heroicons-check-20-solid"
      />
    </div>
    <div class="flex items-center gap-4 ml-[-82px]">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="size"
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
        :size="size"
        label="Switch me"
        description="This is a description"
      />
    </div>
    <div class="flex items-center gap-4">
      <USwitch
        v-for="size in sizes"
        :key="size"
        :size="size"
        label="Switch me"
        description="This is a description"
        unchecked-icon="i-heroicons-x-mark-20-solid"
        checked-icon="i-heroicons-check-20-solid"
      />
    </div>
  </div>
</template>
