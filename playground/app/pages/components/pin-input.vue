<script setup lang="ts">
import theme from '#build/ui/pin-input'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>

const onComplete = (e: string[]) => {
  alert(e.join(''))
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-4">
      <UPinInput placeholder="○" autofocus @complete="onComplete" />
    </div>
    <div class="flex items-center gap-4">
      <UPinInput v-for="variant in variants" :key="variant" placeholder="○" :variant="variant" />
    </div>
    <div class="flex items-center gap-4">
      <UPinInput
        v-for="variant in variants"
        :key="variant"
        placeholder="○"
        :variant="variant"
        color="neutral"
      />
    </div>
    <div class="flex items-center gap-4">
      <UPinInput
        v-for="variant in variants"
        :key="variant"
        placeholder="○"
        :variant="variant"
        color="error"
        highlight
      />
    </div>
    <div class="flex flex-col gap-4">
      <UPinInput placeholder="○" disabled />
      <UPinInput placeholder="○" required />
    </div>
    <div class="flex items-center gap-4">
      <UPinInput
        v-for="size in sizes"
        :key="size"
        placeholder="○"
        :size="size"
      />
    </div>
  </div>
</template>
