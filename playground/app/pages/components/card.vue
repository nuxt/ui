<script setup lang="ts">
import theme from '#build/ui/card'

const variants = Object.keys(theme.variants.variant)

const variant = ref(theme.defaultVariants.variant)
</script>

<template>
  <div class="flex flex-col gap-4">
    <USelect v-model="variant" :items="variants" />

    <UCard :variant="variant" class="w-96">
      <template #header>
        <Placeholder class="h-8" />
      </template>

      <Placeholder class="h-32" />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
  </div>
</template>
