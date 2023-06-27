<script setup>
const items = [{
  label: 'Getting Started',
  icon: 'i-heroicons-information-circle',
  defaultOpen: true,
  slot: 'getting-started'
}, {
  label: 'Installation',
  icon: 'i-heroicons-arrow-down-tray',
  defaultOpen: true,
  slot: 'installation'
}, {
  label: 'Theming',
  icon: 'i-heroicons-eye-dropper',
  defaultOpen: true,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Layouts',
  icon: 'i-heroicons-rectangle-group',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Components',
  icon: 'i-heroicons-square-3-stack-3d',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}, {
  label: 'Utilities',
  icon: 'i-heroicons-wrench-screwdriver',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
}]
</script>

<template>
  <UAccordion :items="items">
    <template #item="{ item }">
      <p class="italic text-gray-900 dark:text-white text-center">
        {{ item.description }}
      </p>
    </template>

    <template #getting-started>
      <div class="flex flex-col justify-center items-center gap-1">
        <NuxtLink to="/getting-started" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
          <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />

          <span class="hidden sm:block">NuxtLabs</span><span class="sm:text-primary-500 dark:sm:text-primary-400">UI</span>
        </NuxtLink>

        <p class="text-sm text-gray-500 dark:text-gray-400">
          Fully styled and customizable components for Nuxt.
        </p>
      </div>
    </template>

    <template #installation="{ description }">
      <div class="flex flex-col justify-center items-center gap-1 mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          Installation
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Install <code>@nuxthq/ui</code> dependency to your project:
        </p>
        <p>
          {{ description }}
        </p>
      </div>

      <div class="flex flex-col items-center">
        <code>$ npm install @nuxtlabs/ui</code>
        <code>$ nnpm install -D @nuxthq/ui</code>
        <code>$ pnpm i -D @nuxthq/ui</code>
      </div>
    </template>
  </UAccordion>
</template>
