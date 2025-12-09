---
title: Nuxt UI v3
description: Nuxt UI v3 is out! After 1500+ commits, this major redesign brings
  improved accessibility, Tailwind CSS v4 support, and full Vue compatibility
navigation: false
image: /assets/blog/nuxt-ui-v3.png
authors:
  - name: Benjamin Canac
    avatar:
      src: https://github.com/benjamincanac.png
    to: https://x.com/benjamincanac
  - name: Sébastien Chopin
    avatar:
      src: https://github.com/atinux.png
    to: https://x.com/atinux
  - name: Hugo Richard
    avatar:
      src: https://github.com/hugorcd.png
    to: https://x.com/hugorcd__
date: 2025-03-12T10:00:00.000Z
category: Release
---

We are thrilled to announce the release of Nuxt UI v3, a complete redesign of our UI library that brings significant improvements in accessibility, performance, and developer experience. This major update represents over 1500 commits of hard work, collaboration, and innovation from our team and the community.

## 🚀 Reimagined from the Ground Up

Nuxt UI v3 represents a major leap forward in our journey to provide the most comprehensive UI solution for Vue and Nuxt developers. This version has been rebuilt from the ground up with modern technologies and best practices in mind.

### **From HeadlessUI to Reka UI**

With Reka UI at its core, Nuxt UI v3 delivers:

• Proper keyboard navigation across all interactive components

• ARIA attributes automatically handled for you

• Focus management that just works

• Screen reader friendly components out of the box

This means you can build applications that work for everyone without becoming an accessibility expert.

### **Tailwind CSS v4 Integration**

The integration with Tailwind CSS v4 brings huge performance improvements:

• **5x faster runtime** with optimized component rendering

• **100x faster build times** thanks to the new CSS-first engine

• Smaller bundle sizes with more efficient styling

Your applications will feel snappier, build quicker, and load faster for your users.

## 🎨 A Brand New Design System

```html
<!-- Before: Inconsistent color usage with duplicate dark mode classes -->
<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
  <h2 class="text-gray-900 dark:text-white text-xl mb-2">User Profile</h2>
  <p class="text-gray-600 dark:text-gray-300">Account settings and preferences</p>
  <button class="bg-blue-500 text-white px-3 py-1 rounded mt-2">Edit Profile</button>
</div>
```

```html
<!-- After: Semantic design tokens with automatic dark mode support -->
<div class="bg-muted p-4 rounded-lg">
  <h2 class="text-highlighted text-xl mb-2">User Profile</h2>
  <p class="text-muted">Account settings and preferences</p>
  <UButton color="primary" size="sm" class="mt-2">Edit Profile</UButton>
</div>
```

Our new color system includes 7 semantic color aliases:

| Color                             | Default  | Description                                      |
|-----------------------------------|----------|--------------------------------------------------|
| :code[primary]{.text-primary}     | `blue`   | Primary color to represent the brand.
| :code[secondary]{.text-secondary} | `blue`   | Secondary color to complement the primary color.
| :code[success]{.text-success}     | `green`  | Used for success states.
| :code[info]{.text-info}           | `blue`   | Used for informational states.
| :code[warning]{.text-warning}     | `yellow` | Used for warning states.
| :code[error]{.text-error}         | `red`    | Used for form error validation states.           |
| `neutral`                         | `slate`  | Neutral color for backgrounds, text, etc.        |

This approach makes your codebase more maintainable and your UI more consistent—especially when working in teams. With these semantic tokens, light and dark mode transitions become effortless, as the system automatically handles the appropriate color values for each theme without requiring duplicate class definitions.

## 💚 Complete Vue Compatibility

We're really happy to expand the scope of Nuxt UI beyond the Nuxt framework. With v3, both Nuxt UI and Nuxt UI Pro now work seamlessly in any Vue project, this means you can:

• Use the same components across all your Vue projects

• Benefit from Nuxt UI's theming system in any Vue application

• Enjoy auto-imports and TypeScript support outside of Nuxt

• Leverage both basic components and advanced Pro components in any Vue project

```ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui()
  ]
})
```

## 📦 Components for Every Need

With 54 core components, 50 Pro components, and 42 Prose components, Nuxt UI v3 provides solutions for virtually any UI challenge:

• **Data Display**: Tables, charts, and visualizations that adapt to your data

• **Navigation**: Menus, tabs, and breadcrumbs that guide users intuitively

• **Feedback**: Toasts, alerts, and modals that communicate clearly

• **Forms**: Inputs, selectors, and validation that simplify data collection

• **Layout**: Grids, containers, and responsive systems that organize content beautifully

Each component is designed to be both beautiful out of the box and deeply customizable when needed.

## 🔷 Improved TypeScript Integration

We've completely revamped our TypeScript integration, with features that make you more productive:

- Complete type safety with helpful autocompletion
- Generic-based components for flexible APIs
- Type-safe theming through a clear, consistent API

```ts
export default defineAppConfig({
  ui: {
    button: {
      // Your IDE will show all available options
      slots: {
        base: 'font-bold rounded-lg'
      },
      defaultVariants: {
        size: 'md',
        color: 'error'
      }
    }
  }
})
```

## ⬆️ Upgrading to v3

We've prepared a comprehensive [migration](https://ui.nuxt.com/getting-started/migration) guide to help you upgrade from v2 to v3. While there are breaking changes due to our complete overhaul, we've worked hard to make the transition as smooth as possible.

## 🎯 Getting Started

Whether you're starting a new project or upgrading an existing one, getting started with Nuxt UI v3 is easy:

```bash
# Create a new Nuxt project with Nuxt UI
npx nuxi@latest init my-app -t ui
```

::code-group{sync="pm"}
```bash [pnpm]
pnpm add @nuxt/ui@latest
```

```bash [yarn]
yarn add @nuxt/ui@latest
```

```bash [npm]
npm install @nuxt/ui@latest
```

```bash [bun]
bun add @nuxt/ui@latest
```
::

::warning
If you're using **pnpm**, ensure that you either set [`shamefully-hoist=true`](https://pnpm.io/npmrc#shamefully-hoist) in your `.npmrc` file or install `tailwindcss` in your project's root directory.
::

Visit our [documentation](https://ui.nuxt.com/getting-started) to explore all the components and features available in Nuxt UI v3.

## 🙏 Thank You

This release represents thousands of hours of work from our team and the community. We'd like to thank everyone who contributed to making Nuxt UI v3 a reality.

We're excited to see what you'll build with Nuxt UI v3!
