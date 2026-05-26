---
title: ProseCallout
description: 'Highlight important information with eye-catching colored boxes and icons.'
category: components
navigation.title: Callout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/prose/Callout.vue
---

## Usage

Use markdown in the default slot of the `callout` component to add eye-catching context to your content.

::component-code{slug="callout" prose}
---
props:
  class: 'w-full my-0'
hide:
  - class
slots:
  default: This is a `callout` with full **markdown** support.
---
::

### Icon

Use the `icon` prop to display an icon next to the content.

::component-code{slug="callout" prose}
---
props:
  icon: i-lucide-square-play
  class: 'w-full my-0'
hide:
  - class
slots:
  default: This is a `callout` with an icon.
---
::

### Color

Use the `color` prop to change the color of the callout.

::component-code{slug="callout" prose}
---
ignore:
  - icon
props:
  icon: i-lucide-info
  color: info
  class: 'w-full my-0'
hide:
  - class
slots:
  default: This is a `callout` with a custom color.
---
::

### Link

You can pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) component such as `to` and `target` to make the callout a link.

::component-code{slug="callout" prose}
---
hide:
  - class
ignore:
  - icon
  - target
props:
  icon: i-lucide-square-play
  to: '/docs/getting-started/installation/nuxt'
  color: neutral
  class: 'w-full my-0'
slots:
  default: Learn how to install `@nuxt/ui` in your project.
---
::

## Shortcuts

You can also use the `note`, `tip`, `warning` and `caution` shortcuts with pre-defined icons and colors.

::code-preview

:::div{class="flex flex-col gap-4 w-full"}

::note{class="w-full my-0"}
Here's some additional information for you.
::

::tip{class="w-full my-0"}
Here's a helpful suggestion.
::

::warning{class="w-full my-0"}
Be careful with this action as it might have unexpected results.
::

::caution{class="w-full my-0"}
This action cannot be undone.
::

:::

#code

```mdc
::note
Here's some additional information.
::

::tip
Here's a helpful suggestion.
::

::warning
Be careful with this action as it might have unexpected results.
::

::caution
This action cannot be undone.
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
