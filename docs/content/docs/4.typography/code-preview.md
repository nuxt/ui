---
title: CodePreview
description: 'Display code examples with a preview and their source for clearer documentation.'
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/CodePreview.vue
---

## Usage

Wrap any content with the `code-preview` component to display a live preview alongside its source code using the `code` slot.

::code-preview{class="[&>div]:*:my-0 [&>div]:*:w-full" label="Preview"}

::code-preview{class="[&>div]:*:my-0"}
`inline code`

#code

```mdc
`inline code`
```

::

#code

````mdc
::code-preview
`inline code`

#code
```mdc
`inline code`
```
::
````

::

## API

### Props

:component-props{prose}

### Slots

:component-slots{prose}

## Theme

:component-theme{prose}

## Changelog

:component-changelog{prefix="prose"}
