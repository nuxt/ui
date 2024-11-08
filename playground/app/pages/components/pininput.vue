<script setup lang="ts">
import theme from '#build/ui/pininput'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const onComplete = (e: any) => {
  console.log(e)
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4">
      <UPinInput type="number" @complete="onComplete" />
    </div>
    <div class="flex items-center gap-12">
      <UPinInput v-for="variant in variants" :key="variant" placeholder="0" :variant="variant" />
    </div>
    <div class="flex items-center gap-12">
      <UPinInput
        v-for="variant in variants"
        :key="variant"
        placeholder="0"
        :variant="variant"
        color="neutral"
      />
    </div>
    <div class="flex items-center gap-12">
      <UPinInput
        v-for="variant in variants"
        :key="variant"
        placeholder="0"
        :variant="variant"
        color="error"
        highlight
      />
    </div>
    <div class="flex flex-col gap-4">
      <UPinInput placeholder="0" disabled />
      <UPinInput placeholder="0" required />
    </div>
    <div class="flex items-center gap-4">
      <UPinInput
        v-for="size in sizes"
        :key="size"
        placeholder="0"
        :size="size"
      />
    </div>
  </div>
</template>
