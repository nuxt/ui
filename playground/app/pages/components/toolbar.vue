<script setup lang="ts">
import theme from '#build/ui/toolbar'

const variants = Object.keys(theme.variants.variant)

const variant = ref(theme.defaultVariants.variant)
const title = ref('Toolbar Title')
</script>

<template>
  <div class=" space-y-4">
    <div class="space-x-2">
      <UButtonGroup>
        <UBadge color="neutral" variant="outline" size="lg" label="title" />

        <UInput v-model="title" :highlight="false" />
      </UButtonGroup>

      <UButtonGroup>
        <UBadge color="neutral" variant="outline" size="lg" label="variant" />

        <USelect v-model="variant" :items="variants" />
      </UButtonGroup>
    </div>
    <UToolbar :variant="variant">
      <Placeholder class="w-full h-8" />
    </UToolbar>

    <UToolbar :variant="variant">
      <template #left>
        <Placeholder class="w-40 h-8" />
      </template>
      <template #center>
        <Placeholder class="w-40 h-8" />
      </template>
      <template #right>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :variant="variant">
      <template #left>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :variant="variant">
      <template #center>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :variant="variant">
      <template #right>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :title="title" />
    <UToolbar :title="title" variant="outline" :ui="{ root: 'border-x-0' }" />
    <UToolbar :title="title" variant="outline" class="border-0 border-b" />
    <UToolbar :title="title" variant="soft" />
    <UToolbar :title="title" variant="subtle" />
    <UToolbar :title="title" variant="solid" />
  </div>
</template>
