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

::component-code
---
collapse: true
prettier: true
hide:
  - class
ignore:
  - items
props:
  items:
    - i-simple-icons-github
    - i-simple-icons-discord
    - i-simple-icons-x
    - i-simple-icons-instagram
    - i-simple-icons-linkedin
    - i-simple-icons-facebook
  class: 'mb-10'
---
::

### Title

Use the `title` prop to set the title above the logos.

::component-code
---
prettier: true
ignore:
  - items
hide:
  - class
props:
  title: 'Trusted by the best front-end teams'
  items:
    - i-simple-icons-github
    - i-simple-icons-discord
    - i-simple-icons-x
    - i-simple-icons-instagram
    - i-simple-icons-linkedin
    - i-simple-icons-facebook
  class: 'my-10'
---
::

### Items

You can display logos in two ways:

1. Using the `items` prop to provide a list of logos. Each item can be either:
  - An icon name (e.g., `i-simple-icons-github`)
  - An object containing `src` and `alt` properties for images, which will be utilized in a `UAvatar` component
2. Using the default slot to have complete control over the content

::tabs{class="gap-0"}

::component-example{label="With items"}
---
name: 'page-logos-with-items'
class: '[&>div]:my-10'
---
::

::component-example{label="With slot"}
---
name: 'page-logos-with-slot'
class: '[&>div]:my-10'
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
hide:
  - class
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
  class: 'my-10'
---
::

::note{to="/docs/components/marquee"}
When you use `marquee` mode, you can customize its behavior by passing props. For more info, check out the `Marquee` component.
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
