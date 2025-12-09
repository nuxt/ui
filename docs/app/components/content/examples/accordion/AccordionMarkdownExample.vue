<script setup lang="ts">
const items = [
  {
    label: 'Is Nuxt UI free to use?',
    icon: 'i-lucide-circle-help',
    content: 'Yes! Nuxt UI is completely free and open source under the MIT license. All 100+ components are available to everyone.'
  },
  {
    label: 'Can I use Nuxt UI with Vue without Nuxt?',
    icon: 'i-lucide-circle-help',
    content: 'Yes! While optimized for Nuxt, Nuxt UI works perfectly with standalone Vue projects via our Vite plugin. You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.'
  },
  {
    label: 'Will Nuxt UI work with other CSS frameworks like UnoCSS?',
    icon: 'i-lucide-circle-help',
    content: 'No. Nuxt UI is designed exclusively for Tailwind CSS. UnoCSS support would require significant architecture changes due to different class naming conventions.'
  },
  {
    label: 'How does Nuxt UI handle accessibility?',
    icon: 'i-lucide-circle-help',
    content: 'Through [Reka UI](https://reka-ui.com/docs/overview/accessibility) integration, Nuxt UI provides automatic ARIA attributes, keyboard navigation, focus management, and screen reader support. While offering a strong foundation, testing in your specific use case remains important.'
  },
  {
    label: 'How is Nuxt UI tested?',
    icon: 'i-lucide-circle-help',
    content: 'Nuxt UI ensures reliability with 1000+ Vitest tests covering core functionality and accessibility.'
  },
  {
    label: 'Is Nuxt UI production-ready?',
    icon: 'i-lucide-circle-help',
    content: 'Yes! Nuxt UI is used in production by thousands of applications with extensive tests, regular updates, and active maintenance.'
  }
]
</script>

<template>
  <UAccordion
    type="multiple"
    :items="items"
    :unmount-on-hide="false"
    :default-value="['3']"
    :ui="{
      trigger: 'text-base',
      body: 'text-base text-muted'
    }"
  >
    <template #body="{ item }">
      <MDC :value="item.content" unwrap="p" />
    </template>
  </UAccordion>
</template>
