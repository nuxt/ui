<script setup lang="ts">
const ui = {
  prose: {
    p: { base: 'my-2.5 text-sm/6' },
    li: { base: 'my-0.5 text-sm/6' },
    ul: { base: 'my-2.5' },
    ol: { base: 'my-2.5' },
    h1: { base: 'text-xl mb-4' },
    h2: { base: 'text-lg mt-6 mb-3' },
    h3: { base: 'text-base mt-4 mb-2' },
    h4: { base: 'text-sm mt-3 mb-1.5' },
    code: { base: 'text-xs' },
    pre: { root: 'my-2.5', base: 'text-xs/5' },
    table: { root: 'my-2.5' },
    hr: { base: 'my-5' }
  }
}

const value = `## Getting started

This is a paragraph with a **tighter typographic scale** applied through the \`Theme\` component.

- First item
- Second item
- Third item

> The spacing and font sizes are smaller than the defaults, making it ideal for compact content areas.`
</script>

<template>
  <UTheme :ui="ui">
    <MDC :value="value" />
  </UTheme>
</template>
