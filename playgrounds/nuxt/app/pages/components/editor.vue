<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`# Nuxt UI: A Modern UI Library

Welcome to **Nuxt UI**, a comprehensive UI library for *Nuxt 3* applications.
Built with [Tailwind CSS](https://tailwindcss.com) and [Reka UI](https://reka-ui.com), it provides a complete set of components for building beautiful interfaces.

![Image](https://ui.nuxt.com/assets/templates/nuxt/dashboard-dark.png)

## Key Features

Nuxt UI combines the best of modern web development

- **Fully typed** with TypeScript support
- *Customizable* theme system with semantic colors
- <u>Accessible</u> components following ARIA guidelines
- Built on top of \`Reka UI\` primitives
- Support for ~~legacy browsers~~ modern standards

### Getting Started

Install Nuxt UI in your project with the following command:

\`\`\`
npx nuxi@latest module add ui
\`\`\`

> *Nuxt UI is designed to be intuitive and easy to use, whether you're building a simple landing page or a complex application.*

### Component Categories

1. Layout components (Container, Card, Accordion)
2. Form components (Input, Select, Checkbox)
3. Navigation (Navbar, Sidebar, Breadcrumb)
4. Feedback (Alert, Toast, Modal)

#### Code Example

Here's a simple example using the \`Button\` component:

\`\`\`
<template>
  <UButton color="primary">
    Click me
  </UButton>
</template>
\`\`\`

---

## Advanced Features

Powerful capabilities for modern applications

- Dark mode support out of the box
- Keyboard shortcuts for improved accessibility
- Nested lists support:
  - With multiple levels
  - And proper spacing

Whether you're working on a personal project or building an enterprise application, Nuxt UI provides all the tools you need to create stunning user interfaces quickly and efficiently. The library is constantly evolving with new components and improvements based on community feedback.

Visit our [documentation](https://ui.nuxt.com) to learn more and explore all available components.
`)

const items: EditorToolbarItem[][] = [[{
  kind: 'undo',
  icon: 'i-lucide-undo'
}, {
  kind: 'redo',
  icon: 'i-lucide-redo'
}], [{
  kind: 'dropdown',
  icon: 'i-lucide-heading',
  items: [{
    type: 'label',
    label: 'Headings'
  }, {
    kind: 'heading',
    level: 1,
    icon: 'i-lucide-heading',
    label: 'Heading 1'
  }, {
    kind: 'heading',
    level: 2,
    icon: 'i-lucide-heading-2',
    label: 'Heading 2'
  }, {
    kind: 'heading',
    level: 3,
    icon: 'i-lucide-heading-3',
    label: 'Heading 3'
  }, {
    kind: 'heading',
    level: 4,
    icon: 'i-lucide-heading-4',
    label: 'Heading 4'
  }]
}, {
  kind: 'dropdown',
  icon: 'i-lucide-list',
  items: [{
    kind: 'bulletList',
    icon: 'i-lucide-list',
    label: 'Bullet List'
  }, {
    kind: 'orderedList',
    icon: 'i-lucide-list-ordered',
    label: 'Ordered List'
  }]
}, {
  kind: 'blockquote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock',
  icon: 'i-lucide-square-code'
}, {
  kind: 'horizontalRule',
  icon: 'i-lucide-separator-horizontal'
}, {
  kind: 'paragraph',
  icon: 'i-lucide-letter-text'
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline'
}, {
  kind: 'mark',
  mark: 'strike',
  icon: 'i-lucide-strikethrough'
}, {
  kind: 'mark',
  mark: 'code',
  icon: 'i-lucide-code'
}], [{
  kind: 'textAlign',
  align: 'left',
  icon: 'i-lucide-align-left'
}, {
  kind: 'textAlign',
  align: 'center',
  icon: 'i-lucide-align-center'
}, {
  kind: 'textAlign',
  align: 'right',
  icon: 'i-lucide-align-right'
}, {
  kind: 'textAlign',
  align: 'justify',
  icon: 'i-lucide-align-justify'
}]]
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="content"
    content-type="markdown"
    class="flex-1 w-full min-h-0"
    :ui="{ content: 'max-w-2xl mx-auto' }"
  >
    <Navbar>
      <UEditorToolbar :editor="editor" :items="items" />
    </Navbar>

    <UEditorToolbar :editor="editor" :items="items" layout="bubble" />

    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
