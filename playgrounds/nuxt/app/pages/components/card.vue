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
    <UCard
      title="Card title"
      description="A short description for the card."
      v-bind="props"
      :ui="{ footer: 'flex justify-end' }"
      class="w-80"
    >
      <Placeholder class="h-24" />

      <template #footer>
        <UButton label="Save" color="neutral" />
      </template>
    </UCard>
  </Matrix>
</template>
