---
title: ChangelogVersion
description: 'A customizable article to display in a changelog.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChangelogVersion.vue
---

## Usage

The ChangelogVersion component provides a flexible way to display an `<article>` element with customizable content including title, description, image, etc.

::code-preview

::u-changelog-version
---
title: 'Introducing Nuxt UI v3'
description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
image: 'https://nuxt.com/assets/blog/nuxt-ui-v3.png'
date: 2025-03-12
authors:
  - name: Benjamin Canac
    description: '@benjamincanac'
    avatar:
      src: https://github.com/benjamincanac.png
    to: https://x.com/benjamincanac
    target: _blank
  - name: Sebastien Chopin
    description: '@atinux'
    avatar:
      src: https://github.com/atinux.png
    to: https://x.com/atinux
    target: _blank
  - name: Hugo Richard
    description: '@hugorcd__'
    avatar:
      src: https://github.com/hugorcd.png
    to: https://x.com/hugorcd__
    target: _blank
to: 'https://nuxt.com/blog/nuxt-ui-v3'
target: '_blank'
class: 'w-full'
ui.container: 'max-w-lg'
---
::

::

::tip{to="/docs/components/changelog-versions"}
Use the `ChangelogVersions` component to display multiple changelog versions in a timeline with an indicator bar on the left.
::

### Title

Use the `title` prop to display the title of the ChangelogVersion.

::component-code
---
hide:
  - class
  - ui
  - ui.container
props:
  title: 'Introducing Nuxt UI v3'
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Description

Use the `description` prop to display the description of the ChangelogVersion.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Date

Use the `date` prop to display the date of the ChangelogVersion.

::tip
The date is automatically formatted to the [current locale](/docs/getting-started/integrations/i18n/nuxt#locale). You can either pass a `Date` object or a string.
::

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Badge

Use the `badge` prop to display a [Badge](/docs/components/badge) on the ChangelogVersion.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
  - date
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  badge: 'Release'
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

You can pass any property from the [Badge](/docs/components/badge#props) component to customize it.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
  - date
  - badge.label
  - badge.color
  - badge.variant
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  badge:
    label: 'Release'
    color: primary
    variant: outline
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Image

Use the `image` prop to display an image in the BlogPost.

::note
If [`@nuxt/image`](https://image.nuxt.com/get-started/installation) is installed, the `<NuxtImg>` component will be used instead of the native `img` tag.
::

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
  - date
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  image: 'https://nuxt.com/assets/blog/nuxt-ui-v3.png'
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Authors

Use the `authors` prop to display a list of [User](/docs/components/user) in the ChangelogVersion as an array of objects with the following properties:

- `name?: string`{lang="ts-type"}
- `description?: string`{lang="ts-type"}
- `avatar?: Omit<AvatarProps, 'size'>`{lang="ts-type"}
- `chip?: boolean | Omit<ChipProps, 'size' | 'inset'>`{lang="ts-type"}
- `size?: UserProps['size']`{lang="ts-type"}
- `orientation?: UserProps['orientation']`{lang="ts-type"}

You can pass any property from the [Link](/docs/components/link#props) component such as `to`, `target`, etc.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
external:
  - authors
externalTypes:
  - UserProps[]
ignore:
  - title
  - description
  - date
  - image
  - authors
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  image: 'https://nuxt.com/assets/blog/nuxt-ui-v3.png'
  authors:
    - name: Benjamin Canac
      description: '@benjamincanac'
      avatar:
        src: https://github.com/benjamincanac.png
      to: https://x.com/benjamincanac
      target: _blank
    - name: Sebastien Chopin
      description: '@atinux'
      avatar:
        src: https://github.com/atinux.png
      to: https://x.com/atinux
      target: _blank
    - name: Hugo Richard
      description: '@hugorcd__'
      avatar:
        src: https://github.com/hugorcd.png
      to: https://x.com/hugorcd__
      target: _blank
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Link

You can pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) component such as `to`, `target`, `rel`, etc.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
  - date
  - image
  - target
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  image: 'https://nuxt.com/assets/blog/nuxt-ui-v3.png'
  to: 'https://nuxt.com/blog/nuxt-ui-v3'
  target: _blank
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

### Indicator

Use the `indicator` prop to hide the indicator dot on the left. Defaults to `true`.

::component-code
---
prettier: true
hide:
  - class
  - ui
  - ui.container
ignore:
  - title
  - description
  - date
  - image
props:
  title: 'Introducing Nuxt UI v3'
  description: 'Nuxt UI v3 is out! After 1500+ commits, this major redesign brings improved accessibility, Tailwind CSS support, and full Vue compatibility.'
  date: 2025-03-12
  image: 'https://nuxt.com/assets/blog/nuxt-ui-v3.png'
  indicator: false
  class: 'w-full'
  ui.container: 'max-w-lg'
---
::

::note
When the `indicator` prop is `false`, the date will be displayed over the title.
::

## Examples

### With body slot

You can use the `body` slot to display custom content between the image and the authors with:

- the [MDC](https://github.com/nuxt-modules/mdc?tab=readme-ov-file#mdc) component from `@nuxtjs/mdc` to display some markdown.
- the [ContentRenderer](https://content.nuxt.com/docs/components/content-renderer) component from `@nuxt/content` to render the content of the page or list.
- or use the `:u-changelog-version` component directly in your content with markdown inside the `body` slot as Nuxt UI provides pre-styled prose components.

::component-example
---
prettier: true
name: 'changelog-version-markdown-example'
collapse: true
---
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
