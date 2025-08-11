<script setup lang="ts">
const content = `
![Nuxt UI v3](https://nuxt.com/assets/blog/nuxt-ui-v3.png)

We are thrilled to introduce Nuxt UI v3, a comprehensive redesign of our UI library that delivers significant improvements in accessibility, performance, and developer experience. This major update represents over 1,500 commits of dedicated work, collaboration, and innovation from our team and the community.

Read the blog post announcement: https://nuxt.com/blog/nuxt-ui-v3

**[Get started with Nuxt UI v3 →](https://ui.nuxt.com/docs/getting-started/installation/nuxt)**

### 🧩 Reka UI: A New Foundation

We've transitioned from [Headless UI](https://headlessui.com/) to [Reka UI](https://reka-ui.com/) as our core component foundation, bringing:

- **Expanded Component Library**: Access to 55+ primitives, significantly expanding our component offerings
- **Future-Proof Development**: Benefit from Reka UI's growing popularity and continuous improvements
- **First-Class Accessibility**: Built-in accessibility features aligned with our commitment to inclusive design

### 🚀 Tailwind CSS v4 Integration

Nuxt UI now leverages the latest [Tailwind CSS v4](https://tailwindcss.com), delivering:

- **Exceptional Performance**: Full builds up to 5× faster, with incremental builds over 100× faster
- **Streamlined Toolchain**: Built-in import handling, vendor prefixing, and syntax transforms with zero additional tooling
- **CSS-First Configuration**: Customize and extend the framework directly in CSS instead of JavaScript configuration

### 🎨 Tailwind Variants

We've adopted [Tailwind Variants](https://www.tailwind-variants.org/) to power our design system, offering:

- **Dynamic Styling**: Create flexible component variants with a powerful, intuitive API
- **Type Safety**: Full TypeScript support with intelligent auto-completion
- **Smart Conflict Resolution**: Efficiently merge conflicting styles with predictable results

## Migration from v2

We want to be transparent: migrating from Nuxt UI v2 to v3 requires significant effort. While we've maintained core concepts and components, Nuxt UI v3 has been rebuilt from the ground up to provide enhanced capabilities.

To upgrade your project:

1. Read our detailed [migration guide](https://ui.nuxt.com/docs/getting-started/migration)
2. Review the new documentation and components before attempting to upgrade
3. Report any issues on our [GitHub repository](https://github.com/nuxt/ui/issues)

## 🙏 Acknowledgements

This release represents thousands of hours of work from our team and the community. We'd like to thank everyone who contributed to making Nuxt UI v3 a reality, especially @romhml, @sandros94, and @hywax for their tremendous work.
`

const version = {
  title: 'Introducing Nuxt UI v3',
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS v4 support, and full Vue compatibility.',
  date: '2025-03-12T00:00:00.000Z',
  badge: 'Release',
  to: 'https://nuxt.com/blog/nuxt-ui-v3',
  target: '_blank',
  content,
  authors: [{
    name: 'Benjamin Canac',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'Benjamin Canac'
    },
    to: 'https://github.com/benjamincanac',
    target: '_blank'
  }]
}
</script>

<template>
  <UChangelogVersion v-bind="version" :ui="{ container: 'max-w-lg' }" class="w-full">
    <template #body>
      <MDC :value="version.content" />
    </template>
  </UChangelogVersion>
</template>
