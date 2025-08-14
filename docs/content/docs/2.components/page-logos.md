---
title: PageLogos
description: 'A list of logos or images to display on your pages.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PageLogos.vue
---

## Usage

The PageLogos component provides a flexible way to display a list of logos or images in your pages.

### Title

Use the `title` prop to set the title above the logos.

::component-code
---
prettier: true
ignore:
  - items
props:
  title: 'Trusted by the best front-end teams'
  items:
    - i-simple-icons-github
    - i-simple-icons-discord
    - i-simple-icons-x
    - i-simple-icons-instagram
    - i-simple-icons-linkedin
    - i-simple-icons-facebook
---
::

### Items

You can display logos in two ways:

1. Using the `items` prop to provide a list of logos. Each item can be either:
  - An icon name (e.g., `i-simple-icons-github`)
  - An object containing `src` and `alt` properties for images, which will be utilized in a `UAvatar` component
2. Using the default slot to have complete control over the content

::tabs{class="gap-0"}

::component-example{label="With Items"}
---
name: 'page-logos-with-items'
---
::

::component-example{label="With Slot"}
---
name: 'page-logos-with-slot'
---
::

::

### Marquee

Use the `marquee` prop to enable a marquee effect for the logos.

::component-code
---
prettier: true
ignore:
  - items
  - marquee
props:
  title: 'Trusted by the best front-end teams'
  marquee: true
  items:
    - i-simple-icons-github
    - i-simple-icons-discord
    - i-simple-icons-x
    - i-simple-icons-instagram
    - i-simple-icons-linkedin
    - i-simple-icons-facebook
---
::

::note{to="/docs/components/marquee"}
When you use `marquee` mode, you can customize its behavior by passing props. For more info, check out the [Marquee](/docs/components/marquee) component.
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
