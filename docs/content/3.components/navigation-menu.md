---
title: NavigationMenu
description: A list of links that can be displayed horizontally or vertically.
links:
  - label: NavigationMenu
    icon: i-custom-radix-vue
    to: https://www.radix-vue.com/components/navigation-menu.html
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/NavigationMenu.vue
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `badge?: string | number | BadgeProps`{lang="ts-type"}
- `trailingIcon?: string`{lang="ts-type"}
- `value?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `onSelect?(e: Event): void`{lang="ts-type"}

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
      to: /getting-started
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
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-heroicons-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-heroicons-circle-stack
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-heroicons-document-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useModal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /composables/use-modal
        - label: useSlideover
          icon: i-heroicons-document-text
          description: Display a slideover within your application.
          to: /composables/use-slideover
        - label: useToast
          icon: i-heroicons-document-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-heroicons-cube-transparent
      to: /components
      active: true
      children:
        - label: Link
          icon: i-heroicons-document-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-heroicons-document-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-heroicons-document-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-heroicons-document-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-heroicons-document-text
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
---
::

::note
You can pass an array of arrays to the `items` prop to display groups of items.
::

::tip
Each item can take a `children` array of objects with the following properties to create submenus:

- `label: string`
- `description?: string`
- `icon?: string`
- `class?: any`
- `onSelect?(e: Event): void`
::

### Orientation

Use the `orientation` prop to change the orientation of the NavigationMenu.

When orientation is `vertical`, a [Collapsible](/components/collapsible) component is used to display children.

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
            description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
          - label: 'Theme'
            icon: 'i-heroicons-cog'
            description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
      - label: Composables
        icon: i-heroicons-circle-stack
        children:
          - label: defineShortcuts
            icon: i-heroicons-document-text
            description: Define shortcuts for your application.
            to: /composables/define-shortcuts
          - label: useModal
            icon: i-heroicons-document-text
            description: Display a modal within your application.
            to: /composables/use-modal
          - label: useSlideover
            icon: i-heroicons-document-text
            description: Display a slideover within your application.
            to: /composables/use-slideover
          - label: useToast
            icon: i-heroicons-document-text
            description: Display a toast within your application.
            to: /composables/use-toast
      - label: Components
        icon: i-heroicons-cube-transparent
        active: true
        children:
          - label: Link
            icon: i-heroicons-document-text
            description: Use NuxtLink with superpowers.
            to: /components/link
          - label: Modal
            icon: i-heroicons-document-text
            description: Display a modal within your application.
            to: /components/modal
          - label: NavigationMenu
            icon: i-heroicons-document-text
            description: Display a list of links.
            to: /components/navigation-menu
          - label: Pagination
            icon: i-heroicons-document-text
            description: Display a list of pages.
            to: /components/pagination
          - label: Popover
            icon: i-heroicons-document-text
            description: Display a non-modal dialog that floats around a trigger element.
            to: /components/popover
          - label: Progress
            icon: i-heroicons-document-text
            description: Show a horizontal bar to indicate task progression.
            to: /components/progress
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
      - label: Help
        icon: i-heroicons-question-mark-circle
        disabled: true
  class: 'data-[orientation=vertical]:w-48'
---
::

::note
Groups will be spaced when orientation is `horizontal` and separated when orientation is `vertical`.
::

### Highlight

Use the `highlight` prop to display a highlighted border for the active item.

Use the `highlight-color` prop to change the color of the border. It defaults to the `color` prop.

::component-code
---
prettier: true
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
        to: /getting-started
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
  class: 'w-full data-[orientation=horizontal]:border-b data-[orientation=vertical]:border-l border-[var(--ui-border)]'
---
::

::note
In this example, the `border-l` and `border-b` classes are applied to display a border, this is not done by default to let you have a clean slate to work with.
::

### Color

Use the `color` prop to change the color of the NavigationMenu.

::component-code
---
ignore:
  - items
  - class
external:
  - items
props:
  color: neutral
  items:
    - - label: Guide
        icon: i-heroicons-book-open
        to: /getting-started
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
  class: 'w-full'
---
::

### Variant

Use the `variant` prop to change the variant of the NavigationMenu.

::component-code
---
ignore:
  - items
  - class
external:
  - items
props:
  color: neutral
  variant: link
  highlight: false
  items:
    - - label: Guide
        icon: i-heroicons-book-open
        to: /getting-started
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
  class: 'w-full'
---
::

::note
The `highlight` prop changes the `pill` variant active item style. Try it out to see the difference.
::

### Trailing Icon

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon) of each item. Defaults to `i-heroicons-chevron-down-20-solid`. This icon is only displayed when an item has children.

::tip
You can also set an icon for a specific item by using the `trailingIcon` property in the item object.
::

::component-code
---
collapse: true
ignore:
  - items
  - class
external:
  - items
props:
  trailingIcon: 'i-heroicons-arrow-small-down-20-solid'
  items:
    - label: Guide
      icon: i-heroicons-book-open
      to: /getting-started
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
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-heroicons-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-heroicons-circle-stack
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-heroicons-document-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useModal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /composables/use-modal
        - label: useSlideover
          icon: i-heroicons-document-text
          description: Display a slideover within your application.
          to: /composables/use-slideover
        - label: useToast
          icon: i-heroicons-document-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-heroicons-cube-transparent
      to: /components
      active: true
      children:
        - label: Link
          icon: i-heroicons-document-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-heroicons-document-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-heroicons-document-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-heroicons-document-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-heroicons-document-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
  class: 'justify-center'
---
::

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
::

### Arrow

Use the `arrow` prop to display an arrow on the NavigationMenu content when items have children.

::component-code
---
collapse: true
ignore:
  - items
  - arrow
  - class
external:
  - items
props:
  arrow: true
  items:
    - label: Guide
      icon: i-heroicons-book-open
      to: /getting-started
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
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-heroicons-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-heroicons-circle-stack
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-heroicons-document-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useModal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /composables/use-modal
        - label: useSlideover
          icon: i-heroicons-document-text
          description: Display a slideover within your application.
          to: /composables/use-slideover
        - label: useToast
          icon: i-heroicons-document-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-heroicons-cube-transparent
      to: /components
      active: true
      children:
        - label: Link
          icon: i-heroicons-document-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-heroicons-document-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-heroicons-document-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-heroicons-document-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-heroicons-document-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-heroicons-document-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
  class: 'justify-center'
---
::

::note
The arrow is animated to follow the active item.
::

## Examples

### Control active item

You can control the active item by using the `default-value` prop or the `v-model` directive with the index of the item.

::component-example
---
collapse: true
name: 'navigation-menu-model-value-example'
---
::

::note
In this example, leveraging [defineShortcuts](/composables/define-shortcuts), you can switch the active item by pressing :kbd{value="1"}, :kbd{value="2"}, or :kbd{value="3"}.
::

::tip
You can also pass the `value` of one of the items if provided.
::

### With custom slot

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-leading`{lang="ts-type"}
- `#{{ item.slot }}-label`{lang="ts-type"}
- `#{{ item.slot }}-trailing`{lang="ts-type"}

::component-example
---
name: 'navigation-menu-custom-slot-example'
---
::

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label` and `#item-trailing` slots to customize all items.
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
