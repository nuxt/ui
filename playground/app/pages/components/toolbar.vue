<script setup lang="ts">
import theme from '#build/ui/toolbar'

const variants = Object.keys(theme.variants.variant)
const variant = ref(theme.defaultVariants.variant)

const sizes = Object.keys(theme.variants.size)
const size = ref(theme.defaultVariants.size)

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
      <UButtonGroup>
        <UBadge color="neutral" variant="outline" size="lg" label="size" />

        <USelect v-model="size" :items="sizes" />
      </UButtonGroup>
    </div>
    <UToolbar :variant="variant" :size="size">
      <Placeholder class="w-full h-8" />
    </UToolbar>

    <UToolbar :variant="variant" :size="size">
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

    <UToolbar :variant="variant" :size="size">
      <template #left>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :variant="variant" :size="size">
      <template #center>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <UToolbar :variant="variant">
      <template #right>
        <Placeholder class="w-40 h-8" />
      </template>
    </UToolbar>

    <h2 class="text-2xl font-semibold">
      Variants:
    </h2>
    <UToolbar :title="title" />
    <UToolbar :title="title" variant="outline" :ui="{ root: 'border-x-0' }" />
    <UToolbar :title="title" variant="outline" class="border-0 border-b" />
    <UToolbar :title="title" variant="soft" />
    <UToolbar :title="title" variant="subtle" />
    <UToolbar :title="title" variant="solid" />

    <h2 class="text-2xl font-semibold">
      Sizes:
    </h2>
    <UToolbar :title="title" variant="solid" size="sm">
      <template #right>
        <UButton label="Home" color="neutral" variant="soft" size="sm" />
        <UButton label="About" color="neutral" variant="soft" size="sm" />
      </template>
    </UToolbar>
    <UToolbar :title="title" variant="solid" size="md">
      <template #right>
        <UButton label="Home" color="neutral" variant="soft" size="md" />
        <UButton label="About" color="neutral" variant="soft" size="md" />
      </template>
    </UToolbar>
    <UToolbar :title="title" variant="solid" size="lg">
      <template #right>
        <UButton label="Home" color="neutral" variant="soft" size="lg" />
        <UButton label="About" color="neutral" variant="soft" size="lg" />
      </template>
    </UToolbar>
    <UToolbar :title="title" variant="solid" size="xl">
      <template #right>
        <UButton label="Home" color="neutral" variant="soft" size="xl" />
        <UButton label="About" color="neutral" variant="soft" size="xl" />
      </template>
    </UToolbar>
  </div>
</template>
