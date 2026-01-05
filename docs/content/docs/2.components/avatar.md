---
description: An img element with fallback and Nuxt Image support.
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Avatar.vue
---

## Usage

The Avatar uses the `<NuxtImg>` component when [`@nuxt/image`](https://github.com/nuxt/image) is installed, falling back to `img` otherwise.

::component-code
---
ignore:
  - src
props:
  src: 'https://github.com/benjamincanac.png'
---
::


::note
You can pass any property from the HTML `<img>` element such as `alt`, `loading`, etc.
::

::tip
To opt-out of `@nuxt/image`, use the `as` prop: `:as="{ img: 'img' }"`.
::

### Src

Use the `src` prop to set the image URL.

::component-code
---
props:
  src: 'https://github.com/benjamincanac.png'
---
::

### Size

Use the `size` prop to set the size of the Avatar.

::component-code
---
ignore:
  - src
props:
  src: 'https://github.com/benjamincanac.png'
  size: xl
---
::

::note
The `<img>` element's `width` and `height` are automatically set based on the `size` prop.
::

### Icon

Use the `icon` prop to display a fallback [Icon](/docs/components/icon).

::component-code
---
props:
  icon: 'i-lucide-image'
  size: md
---
::

### Text

Use the `text` prop to display a fallback text.

::component-code
---
props:
  text: '+1'
  size: md
---
::

### Alt

When no icon or text is provided, the **initials** of the `alt` prop is used as fallback.

::component-code
---
props:
  alt: 'Benjamin Canac'
  size: md
---
::

::note
The `alt` prop is passed to the `img` element as the `alt` attribute.
::

### Chip

Use the `chip` prop to display a chip around the Avatar.

::component-code
---
prettier: true
ignore:
  - src
  - chip.inset
props:
  src: 'https://github.com/benjamincanac.png'
  chip:
    inset: true
---
::

## Examples

### With tooltip

You can use a [Tooltip](/docs/components/tooltip) component to display a tooltip when hovering the Avatar.

:component-example{name="avatar-tooltip-example"}

### With mask

You can use a CSS mask to display an Avatar with a custom shape instead of a simple circle.

:component-example{name="avatar-mask-example"}

## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes" target="_blank"}
This component also supports all native `<img>` HTML attributes.
::

## Theme

:component-theme

## Changelog

:component-changelog
