---
title: NavigationMenu
description: A list of links that can be displayed horizontally or vertically.
links:
  - label: NavigationMenu
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/navigation-menu.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/NavigationMenu.vue
navigation:
  badge:
    label: Todo
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `badge?: string | number | BadgeProps`{lang="ts-type"}
- `trailingIcon?: string`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `select?(e: Event): void`{lang="ts-type"}

You can also pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
props:
  items:
    - label: Guide
      icon: i-heroicons-book-open
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-heroicons-home
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-heroicons-cloud-arrow-down
        - label: 'Icons'
          icon: 'i-heroicons-face-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        - label: 'Colors'
          icon: 'i-heroicons-swatch'
          description: 'Choose a primary and a gray color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-heroicons-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-heroicons-circle-stack
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-heroicons-document-text-20-solid
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useModal
          icon: i-heroicons-document-text-20-solid
          description: Display a modal within your application.
          to: /composables/use-modal
        - label: useSlideover
          icon: i-heroicons-document-text-20-solid
          description: Display a slideover within your application.
          to: /composables/use-slideover
        - label: useToast
          icon: i-heroicons-document-text-20-solid
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-heroicons-cube-transparent
      to: /components
      active: true
      children:
        - label: Link
          icon: i-heroicons-document-text-20-solid
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-heroicons-document-text-20-solid
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-heroicons-document-text-20-solid
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-heroicons-document-text-20-solid
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-heroicons-document-text-20-solid
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-heroicons-document-text-20-solid
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
    - label: GitHub
      icon: i-simple-icons-github
      badge: 3.8k
      to: https://github.com/nuxt/ui
      target: _blank
    - label: Help
      icon: i-heroicons-question-mark-circle
      disabled: true
  class: 'justify-center'
---
::

::note
You can pass an array of arrays to the `items` prop to display groups of items.
::

::tip{class="[&_ul]:my-0 [&_ul]:marker:text-green-500/50 dark:[&_ul]:marker:text-green-400/50"}
Each item can take a `children` array of objects with the following properties to create submenus:

- `label: string`
- `description?: string`
- `icon?: string`
- `class?: any`
- `select?(e: Event): void`
::

### Orientation

Use the `orientation` prop to change the orientation of the NavigationMenu.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
props:
  orientation: 'vertical'
  items:
    - - label: Guide
        icon: i-heroicons-book-open
      - label: Composables
        icon: i-heroicons-circle-stack
        to: /composables
      - label: Components
        icon: i-heroicons-cube-transparent
        to: /components
        active: true
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
---
::

::note
Groups will be spaced between each other when orientation is `horizontal` and separated by a line when orientation is `vertical`.
::

### Highlight

Use the `highlight` prop to display a highlighted border for the active item.

Use the `highlight-color` prop to change the color of the border. It defaults to the `color` prop.

::component-code
---
prettier: true
collapse: true
ignore:
  - items
  - highlight
  - class
external:
  - items
props:
  highlight: true
  highlightColor: ''
  orientation: 'horizontal'
  items:
    - - label: Guide
        icon: i-heroicons-book-open
      - label: Composables
        icon: i-heroicons-circle-stack
        to: /composables
      - label: Components
        icon: i-heroicons-cube-transparent
        to: /components
        active: true
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
  class: 'data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-l border-gray-200 dark:border-gray-800'
---
::

::note
In this example, the `border-l` and `border-b` classes are applied to display a gray line, this is not done by default to let you have a clean slate to work with.
::

### Color

Use the `color` prop to change the color of the NavigationMenu.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
props:
  color: 'gray'
  items:
    - - label: Guide
        icon: i-heroicons-book-open
      - label: Composables
        icon: i-heroicons-circle-stack
        to: /composables
      - label: Components
        icon: i-heroicons-cube-transparent
        to: /components
        active: true
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
---
::

### Variant

Use the `variant` prop to change the variant of the NavigationMenu.

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
props:
  color: 'gray'
  variant: 'link'
  highlight: false
  items:
    - - label: Guide
        icon: i-heroicons-book-open
      - label: Composables
        icon: i-heroicons-circle-stack
        to: /composables
      - label: Components
        icon: i-heroicons-cube-transparent
        to: /components
        active: true
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
---
::

::note
The `highlight` prop changes the `pill` variant active item style. Try it out to see the difference.
::

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
