<template>
  <div class="h-full bg-tw-gray-50 min-h-screen">
    <UContainer class="py-8">
      <div class="lg:grid lg:grid-cols-12 lg:gap-10 lg:relative">
        <aside class="pb-8 lg:pb-0 lg:sticky lg:top-0 px-4 sm:px-6 lg:px-0 lg:pt-8 lg:-mt-8 lg:self-start lg:col-span-3" style="position: sticky;">
          <nav class="space-y-3">
            <div class="font-bold text-lg pb-6">
              @nuxthq/ui
            </div>

            <ULink
              v-for="component in components"
              :key="component.name"
              :to="`/components/${component.name}`"
              class="text-sm font-medium block w-full"
              active-class="text-primary-600"
              inactive-class="text-tw-gray-500 hover:text-tw-gray-900"
            >
              {{ component.name }}
            </ULink>
          </nav>
        </aside>

        <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <NuxtPage />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup>
useMeta({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
  ],
  htmlAttrs: {
    class: 'bg-tw-gray-50'
  }
})

const components = [
  { name: 'Avatar' },
  { name: 'Button' },
  { name: 'Badge' },
  { name: 'Dropdown' },
  { name: 'Icon' },
  { name: 'Toggle' },
  { name: 'Card' },
  { name: 'Modal' },
  { name: 'Select' }
]
</script>
