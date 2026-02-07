---
description: A headless component to theme child components.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Theme.vue
navigation.badge: Soon
---

## Usage

The Theme component allows you to override the theme of all child components without modifying each component individually. It's a headless component that provides theme overrides through Vue's provide/inject mechanism.

Use the `ui` prop to pass an object where keys are component names and values are their slot class overrides.

::component-example
---
name: 'theme-example'
---
::

::note
The Theme component doesn't render any HTML element, it only provides theme overrides to its children.
::

### Multiple

You can theme multiple component types at once by passing different keys in the `ui` prop.

::component-example
---
name: 'theme-multiple-example'
---
::

### Nested

Theme components can be nested. When nested, the innermost Theme takes precedence.

::component-example
---
name: 'theme-nested-example'
---
::

### Priority

The `ui` prop on individual components takes priority over the Theme component. This allows you to override specific instances while still benefiting from the shared theme.

::component-example
---
name: 'theme-priority-example'
---
::

#### Works deeply

The Theme component uses Vue's provide/inject mechanism to provide the theme overrides to the child components.
This means that the theme overrides are available to all child components, regardless of how deeply nested they are.

::component-example
---
name: 'theme-deep-example'
---
::

::note
For app-level theme configuration, we still recommend using the `app.config.ts` file.
::

## Examples

### Prose

You can theme prose (typography) components by nesting them under the `prose` key.

```vue
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
</script>

<template>
  <UTheme :ui="ui">
    <MDC :value="value" />
  </UTheme>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
