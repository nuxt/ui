---
title: FieldGroup
description: 'Group related fields together for comprehensive API documentation.'
framework: nuxt
category: components
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/FieldGroup.vue
---

## Usage

Group fields together in a list.

::code-preview

::field-group{class="my-0"}

  ::field{name="analytics" type="boolean"}
  Default to `false` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
  Default to `false` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
  Default to `false` - Enables cache storage to cache your server route responses or functions using Nitro's `cachedEventHandler` and `cachedFunction`
  ::

  ::field{name="database" type="boolean"}
  Default to `false` - Enables SQL database to store your application's data.
  ::

::

#code

```mdc
::field-group
  ::field{name="analytics" type="boolean"}
    Default to `false` - Enables analytics for your project (coming soon).
  ::

  ::field{name="blob" type="boolean"}
    Default to `false` - Enables blob storage to store static assets, such as images, videos and more.
  ::

  ::field{name="cache" type="boolean"}
    Default to `false` - Enables cache storage to cache your server route responses or functions using Nitro's `cachedEventHandler` and `cachedFunction`
  ::

  ::field{name="database" type="boolean"}
    Default to `false` - Enables SQL database to store your application's data.
  ::
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
