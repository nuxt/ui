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

The Theme component allows you to override the theme of all child components without modifying each one individually. It uses Vue's `provide` / `inject` mechanism under the hood, so the overrides apply at any depth.

Use the `ui` prop to pass an object where keys are component names (camelCase) and values are their slot class overrides:

::component-example
---
name: 'theme-example'
---
::

::note
The Theme component doesn't render any HTML element, it only provides theme overrides to its children.
::

::framework-only
#nuxt
:::tip
For app-level theme configuration, we recommend using the `app.config.ts` file instead.
:::

#vue
:::tip
For app-level theme configuration, we recommend using the `vite.config.ts` file instead.
:::
::

### Multiple

You can theme multiple component types at once by passing different keys in the `ui` prop.

::component-example
---
name: 'theme-multiple-example'
---
::

### Nested

Theme components can be nested. When nested, the innermost Theme's overrides take precedence for the components it wraps.

::component-example
---
name: 'theme-nested-example'
---
::

### Priority

The `ui` prop on individual components always takes priority over the Theme component. This lets you override specific instances while still benefiting from the shared theme.

::component-example
---
name: 'theme-priority-example'
---
::

### Deep

Because the Theme component uses Vue's `provide` / `inject`, the overrides are available to all descendant components regardless of how deeply nested they are.

::component-example
---
name: 'theme-deep-example'
---
::

::note
In this example, `MyButton` is a custom component that renders a `UButton` internally. The theme overrides still apply because they propagate through the entire component tree.
::

## Examples

### With form components

Use the Theme component to apply consistent styling across a group of form components.

::component-example
---
name: 'theme-form-example'
---
::

### With prose components

You can theme prose (typography) components by nesting them under the `prose` key. This is useful when rendering Markdown content with a tighter or custom typographic scale.

::component-example
---
name: 'theme-prose-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Changelog

:component-changelog
