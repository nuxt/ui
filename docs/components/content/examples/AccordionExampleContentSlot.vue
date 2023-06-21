<script setup>
const items = ref([
  {
    title: "Getting Started",
    leadingIcon: "i-heroicons-information-circle",
    opend: true,
    content:" "
  },
  {
    title: "Installation",
    leadingIcon: "i-heroicons-arrow-down-tray",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Theming",
    leadingIcon: "i-heroicons-eye-dropper",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Components",
    leadingIcon: "i-heroicons-square-3-stack-3d",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Utilities",
    leadingIcon: "i-heroicons-wrench-screwdriver",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  }
]);

const subItems = ref([
  {
    title: "Getting Started",
    leadingIcon: "i-heroicons-information-circle",
    opend: true,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Installation",
    leadingIcon: "i-heroicons-arrow-down-tray",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Theming",
    leadingIcon: "i-heroicons-eye-dropper",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Components",
    leadingIcon: "i-heroicons-square-3-stack-3d",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  },
  {
    title: "Utilities",
    leadingIcon: "i-heroicons-wrench-screwdriver",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate."
  }
]);
</script>

<template>
  <UAccordion :items="items" default-open-all>
    <template #item-1-content>
      <div class="flex justify-start items-center w-full pt-1 pb-3">
        <div class="flex flex-col justify-center items-start ml-2">
          <NuxtLink to="/" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
            <Logo class="w-8 h-8 text-primary-500 dark:text-primary-400" />
            NuxtLabs<span class="text-primary-500 dark:text-primary-400">UI</span>
          </NuxtLink>
          <p class="text-sm text-gray-500">
            Fully styled and customizable components for Nuxt.
          </p>
        </div>
      </div>

      <UAccordion :items="subItems" color="emerald" />
    </template>

    <template #item-2-content="{ content }">
      <div class="flex flex-col justify-center items-start mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Installation
        </h3>
        <p class="text-sm text-gray-500 mb-2">
          Install <code>@nuxthq/ui</code> dependency to your project:
        </p>
        <p>
          {{ content }}
        </p>
      </div>

      <div class="flex flex-col mb-2">
        <code>$ npm install @nuxtlabs/ui</code>
        <code>$ nnpm install -D @nuxthq/ui</code>
        <code>$ pnpm i -D @nuxthq/ui</code>
      </div>
    </template>
  </UAccordion>
</template>
