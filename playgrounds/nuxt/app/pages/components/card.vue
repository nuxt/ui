<script setup lang="ts">
import theme from '#build/ui/card'

const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  variant: [theme.defaultVariants.variant]
})
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <UCard v-bind="props" class="w-80">
      <template #header>
        <Placeholder class="h-8" />
      </template>

      <Placeholder class="h-24" />

      <template #footer>
        <Placeholder class="h-8" />
      </template>
    </UCard>
  </Matrix>
</template>
