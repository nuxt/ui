---
title: Field
description: 'Document API parameters, props, and configuration options clearly.'
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/Field.vue
---

## Usage

A field, prop or parameter to display in your content.

::code-preview
::field{name="name" type="string" required class="w-full"}
The `description` can be set as prop or in the default slot with full **markdown** support.
::

#code

```mdc
::field{name="name" type="string" required}
The `description` can be set as prop or in the default slot with full **markdown** support.
::
```

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
