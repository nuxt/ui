<script setup lang="ts">
const items = [
  {
    label: 'What are the main considerations when upgrading to Nuxt UI v3?',
    icon: 'i-lucide-circle-help',
    content: 'The transition to v3 involves significant changes, including new component structures, updated theming approaches, and revised TypeScript definitions. We recommend a careful, incremental upgrade process, starting with thorough testing in a development environment.'
  },
  {
    label: 'Is Nuxt UI v3 compatible with standalone Vue projects?',
    icon: 'i-lucide-circle-help',
    content: 'Nuxt UI is now compatible with Vue! You can follow the [installation guide](/docs/getting-started/installation/vue) to get started.'
  },
  {
    label: 'Will Nuxt UI v3 work with other CSS frameworks like UnoCSS?',
    icon: 'i-lucide-circle-help',
    content: 'Nuxt UI v3 is currently designed to work exclusively with Tailwind CSS. While there\'s interest in UnoCSS support, implementing it would require significant changes to the theme structure due to differences in class naming conventions. As a result, we don\'t have plans to add UnoCSS support in v3.'
  },
  {
    label: 'How does Nuxt UI v3 handle accessibility?',
    icon: 'i-lucide-circle-help',
    content: 'Nuxt UI v3 enhances accessibility through Reka UI integration. This provides automatic ARIA attributes, keyboard navigation support, intelligent focus management, and screen reader announcements. While offering a strong foundation, proper implementation and testing in your specific use case remains crucial for full accessibility compliance. For more detailed information, refer to [Reka UI\'s accessibility documentation](https://reka-ui.com/docs/overview/accessibility).'
  },
  {
    label: 'What is the testing approach for Nuxt UI v3?',
    icon: 'i-lucide-circle-help',
    content: 'Nuxt UI v3 ensures reliability with 1000+ Vitest tests, covering core functionality and accessibility. This robust testing suite supports the library\'s stability and serves as a reference for developers.'
  },
  {
    label: 'Is this version stable and suitable for production use?',
    icon: 'i-lucide-circle-help',
    content: 'As Nuxt UI v3 is currently in alpha, we recommend thorough testing before using it in production environments. We\'re actively working on stabilization and welcome feedback from early adopters to improve the library. Feel free to report any issues you encounter on our [GitHub repository](https://github.com/nuxt/ui/issues).'
  }
]
</script>

<template>
  <UAccordion
    type="multiple"
    :items="items"
    :unmount-on-hide="false"
    :default-value="['0']"
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
