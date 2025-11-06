<script setup lang="ts">
import type { EditorContent, EditorToolbarItem } from '@nuxt/ui'

const content = ref<EditorContent>(`
<h1>Nuxt UI: A Modern UI Library</h1>

<p>Welcome to <strong>Nuxt UI</strong>, a comprehensive UI library for <em>Nuxt 3</em> applications.<br> Built with <a href="https://tailwindcss.com">Tailwind CSS</a> and <a href="https://reka-ui.com">Reka UI</a>, it provides a complete set of components for building beautiful interfaces.</p>

<h2>Key Features</h2>

<p style="text-align: center">Nuxt UI combines the best of modern web development</p>

<ul>
  <li><strong>Fully typed</strong> with TypeScript support</li>
  <li><em>Customizable</em> theme system with semantic colors</li>
  <li><u>Accessible</u> components following ARIA guidelines</li>
  <li>Built on top of <code>Reka UI</code> primitives</li>
  <li>Support for <s>legacy browsers</s> modern standards</li>
</ul>

<h3>Getting Started</h3>

<p>Install Nuxt UI in your project with the following command:</p>

<pre><code>npx nuxi@latest module add ui</code></pre>

<blockquote>
  <p><em>Nuxt UI is designed to be intuitive and easy to use, whether you're building a simple landing page or a complex application.</em></p>
</blockquote>

<h3>Component Categories</h3>

<ol>
  <li>Layout components (Container, Card, Accordion)</li>
  <li>Form components (Input, Select, Checkbox)</li>
  <li>Navigation (Navbar, Sidebar, Breadcrumb)</li>
  <li>Feedback (Alert, Toast, Modal)</li>
</ol>

<h4>Code Example</h4>

<p>Here's a simple example using the <code>Button</code> component:</p>

<pre><code>&lt;template&gt;
  &lt;UButton color="primary"&gt;
    Click me
  &lt;/UButton&gt;
&lt;/template&gt;</code></pre>

<hr>

<h2>Advanced Features</h2>

<p style="text-align: right">Powerful capabilities for modern applications</p>

<ul>
  <li>Dark mode support out of the box</li>
  <li>Keyboard shortcuts for improved accessibility</li>
  <li>
    <p>Nested lists support:</p>
    <ul>
      <li>With multiple levels</li>
      <li>And proper spacing</li>
    </ul>
  </li>
</ul>

<p style="text-align: justify">Whether you're working on a personal project or building an enterprise application, Nuxt UI provides all the tools you need to create stunning user interfaces quickly and efficiently. The library is constantly evolving with new components and improvements based on community feedback.</p>

<p>Visit our <a href="https://ui.nuxt.com">documentation</a> to learn more and explore all available components.</p>
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
  <UEditor v-slot="{ editor }" v-model:html="content" v-model="content" class="flex-1 w-full min-h-0">
    <Navbar>
      <UEditorToolbar :editor="editor" :items="items" variant="fixed" />
    </Navbar>

    <UEditorToolbar :editor="editor" :items="items" variant="bubble" />
    <UEditorToolbar :editor="editor" :items="items" variant="floating" />
  </UEditor>
</template>
