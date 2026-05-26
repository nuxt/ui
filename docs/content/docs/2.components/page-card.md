---
title: PageCard
description: 'A pre-styled card component that displays a title, description and optional link.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageCard.vue
---

## Usage

The PageCard component provides a flexible way to display content in a card with an illustration in the default slot.

::code-preview

::u-page-card
---
title: 'Tailwind CSS'
description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
icon: 'i-simple-icons-tailwindcss'
class: 'w-96'
---

:img{src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full"}
::

::

::tip
Use the [PageGrid](/docs/components/page-grid), [PageColumns](/docs/components/page-columns) or [PageList](/docs/components/page-list) components to display multiple PageCard.
::

### Title

Use the `title` prop to set the title of the card.

::component-code
---
hide:
  - class
props:
  title: 'Tailwind CSS'
  class: 'w-96'
---
::

### Description

Use the `description` prop to set the description of the card.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  class: 'w-96'
---
::

### Icon

Use the `icon` prop to set the icon of the card.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - description
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  class: 'w-96'
---
::

### Link

You can pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) component such as `to`, `target`, `rel`, etc.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - description
  - icon
  - target
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  to: 'https://tailwindcss.com/docs/v4-beta'
  target: _blank
  class: 'w-96'
---
::

### Variant

Use the `variant` prop to change the style of the card.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - description
  - icon
  - to
  - target
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  to: 'https://tailwindcss.com/docs/v4-beta'
  target: _blank
  variant: soft
  class: 'w-96'
---
::

::tip
You can apply the `light` or `dark` class to the `links` slot when using the `solid` variant to reverse the colors.
::

### Orientation

Use the `orientation` prop to change the orientation with the default slot. Defaults to `vertical`.

::component-code
---
prettier: true
ignore:
  - title
  - description
  - icon
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  orientation: horizontal
slots:
  default: |

    <img src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full" />
---

:img{src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full"}
::

### Reverse

Use the `reverse` prop to reverse the orientation of the default slot.

::component-code
---
prettier: true
ignore:
  - title
  - description
  - icon
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  orientation: horizontal
  reverse: true
slots:
  default: |

    <img src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full" />
---

:img{src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full"}
::

### Highlight

Use the `highlight` and `highlight-color` props to display a highlighted border around the card.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - description
  - icon
  - orientation
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  orientation: horizontal
  highlight: true
  highlightColor: 'primary'
slots:
  default: |

    <img src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full" />
---

:img{src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full"}
::

### Spotlight

Use the `spotlight` and `spotlight-color` props to display a spotlight effect that follows your mouse cursor and highlights borders on hover.

::note
The spotlight effect will take over hover effects when using a `to` prop. It's best to use it with the `outline` variant.
::

::component-code
---
prettier: true
hide:
  - class
ignore:
  - title
  - description
  - icon
  - orientation
props:
  title: 'Tailwind CSS'
  description: 'Nuxt UI integrates with latest Tailwind CSS, bringing significant improvements.'
  icon: 'i-simple-icons-tailwindcss'
  orientation: horizontal
  spotlight: true
  spotlightColor: 'primary'
slots:
  default: |

    <img src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full" />
---

:img{src="/tailwindcss-v4.svg" alt="Tailwind CSS" class="w-full"}
::

::tip
You can also customize the color and size by using the `--spotlight-color` and `--spotlight-size` CSS variables:

```vue
<template>
  <UPageCard spotlight class="[--spotlight-color:var(--ui-error)] [--spotlight-size:200px]" />
</template>
```
::

## Examples

### As a testimonial

Use the [User](/docs/components/user) component in the `header` or `footer` slot to make the card look like a testimonial.

::component-example
---
name: 'page-card-testimonial-example'
---
::

::tip{to="/docs/components/page-columns"}
You can use the `PageColumns` component to display multiple PageCard in a multi-column layout.
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
