---
description: A renderless component to theme child components.
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Theme.vue
navigation.badge: Soon
---

## Usage

The Theme component allows you to override the theme of all child components without modifying each component individually. It's a renderless component that provides theme overrides through Vue's provide/inject mechanism.

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

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
