---
title: NavigationMenu
description: A list of links that can be displayed horizontally or vertically.
category: navigation
links:
  - label: NavigationMenu
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/navigation-menu
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
- `type?: 'label' | 'link'`{lang="ts-type"}
- `value?: string`{lang="ts-type"}
- `disabled?: boolean`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `onSelect?(e: Event): void`{lang="ts-type"}

You can pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

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
      icon: i-lucide-book-open
      to: /getting-started
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-lucide-house
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-lucide-cloud-download
        - label: 'Icons'
          icon: 'i-lucide-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        - label: 'Colors'
          icon: 'i-lucide-swatch-book'
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-lucide-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-lucide-database
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-lucide-file-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useOverlay
          icon: i-lucide-file-text
          description: Display a modal/slideover within your application.
          to: /composables/use-overlay
        - label: useToast
          icon: i-lucide-file-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-lucide-box
      to: /components
      active: true
      children:
        - label: Link
          icon: i-lucide-file-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-lucide-file-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-lucide-file-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-lucide-file-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-lucide-file-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-lucide-file-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
    - label: GitHub
      icon: i-simple-icons-github
      badge: 3.8k
      to: https://github.com/nuxt/ui
      target: _blank
    - label: Help
      icon: i-lucide-circle-help
      disabled: true
  class: 'w-full justify-center'
---
::

::note
You can also pass an array of arrays to the `items` prop to display groups of items.
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

::note
When orientation is `vertical`, a [Collapsible](/components/collapsible) component is used to display children. You can control the open state of each item using the `open` and `defaultOpen` properties.
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
  orientation: 'vertical'
  items:
    - - label: Links
        type: 'label'
      - label: Guide
        icon: i-lucide-book-open
        children:
          - label: Introduction
            description: Fully styled and customizable components for Nuxt.
            icon: i-lucide-house
          - label: Installation
            description: Learn how to install and configure Nuxt UI in your application.
            icon: i-lucide-cloud-download
          - label: 'Icons'
            icon: 'i-lucide-smile'
            description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
          - label: 'Colors'
            icon: 'i-lucide-swatch-book'
            description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
          - label: 'Theme'
            icon: 'i-lucide-cog'
            description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
      - label: Composables
        icon: i-lucide-database
        children:
          - label: defineShortcuts
            icon: i-lucide-file-text
            description: Define shortcuts for your application.
            to: /composables/define-shortcuts
          - label: useOverlay
            icon: i-lucide-file-text
            description: Display a modal/slideover within your application.
            to: /composables/use-overlay
          - label: useToast
            icon: i-lucide-file-text
            description: Display a toast within your application.
            to: /composables/use-toast
      - label: Components
        icon: i-lucide-box
        to: /components
        active: true
        defaultOpen: true
        children:
          - label: Link
            icon: i-lucide-file-text
            description: Use NuxtLink with superpowers.
            to: /components/link
          - label: Modal
            icon: i-lucide-file-text
            description: Display a modal within your application.
            to: /components/modal
          - label: NavigationMenu
            icon: i-lucide-file-text
            description: Display a list of links.
            to: /components/navigation-menu
          - label: Pagination
            icon: i-lucide-file-text
            description: Display a list of pages.
            to: /components/pagination
          - label: Popover
            icon: i-lucide-file-text
            description: Display a non-modal dialog that floats around a trigger element.
            to: /components/popover
          - label: Progress
            icon: i-lucide-file-text
            description: Show a horizontal bar to indicate task progression.
            to: /components/progress
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
      - label: Help
        icon: i-lucide-circle-help
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
collapse: true
prettier: true
ignore:
  - items
  - class
external:
  - items
props:
  highlight: true
  highlightColor: 'primary'
  orientation: 'horizontal'
  items:
    - - label: Guide
        icon: i-lucide-book-open
        children:
          - label: Introduction
            description: Fully styled and customizable components for Nuxt.
            icon: i-lucide-house
          - label: Installation
            description: Learn how to install and configure Nuxt UI in your application.
            icon: i-lucide-cloud-download
          - label: 'Icons'
            icon: 'i-lucide-smile'
            description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
          - label: 'Colors'
            icon: 'i-lucide-swatch-book'
            description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
          - label: 'Theme'
            icon: 'i-lucide-cog'
            description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
      - label: Composables
        icon: i-lucide-database
        children:
          - label: defineShortcuts
            icon: i-lucide-file-text
            description: Define shortcuts for your application.
            to: /composables/define-shortcuts
          - label: useOverlay
            icon: i-lucide-file-text
            description: Display a modal/slideover within your application.
            to: /composables/use-overlay
          - label: useToast
            icon: i-lucide-file-text
            description: Display a toast within your application.
            to: /composables/use-toast
      - label: Components
        icon: i-lucide-box
        to: /components
        active: true
        defaultOpen: true
        children:
          - label: Link
            icon: i-lucide-file-text
            description: Use NuxtLink with superpowers.
            to: /components/link
          - label: Modal
            icon: i-lucide-file-text
            description: Display a modal within your application.
            to: /components/modal
          - label: NavigationMenu
            icon: i-lucide-file-text
            description: Display a list of links.
            to: /components/navigation-menu
          - label: Pagination
            icon: i-lucide-file-text
            description: Display a list of pages.
            to: /components/pagination
          - label: Popover
            icon: i-lucide-file-text
            description: Display a non-modal dialog that floats around a trigger element.
            to: /components/popover
          - label: Progress
            icon: i-lucide-file-text
            description: Show a horizontal bar to indicate task progression.
            to: /components/progress
    - - label: GitHub
        icon: i-simple-icons-github
        badge: 3.8k
        to: https://github.com/nuxt/ui
        target: _blank
      - label: Help
        icon: i-lucide-circle-help
        disabled: true
  class: 'data-[orientation=horizontal]:border-b border-(--ui-border) data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48'
---
::

::note
In this example, the `border-b` class is applied to display a border in `horizontal` orientation, this is not done by default to let you have a clean slate to work with.
::

::caution
In `vertical` orientation, the `highlight` prop only highlights the border of active children.
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
        icon: i-lucide-book-open
        to: /getting-started
      - label: Composables
        icon: i-lucide-database
        to: /composables
      - label: Components
        icon: i-lucide-box
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
        icon: i-lucide-book-open
        to: /getting-started
      - label: Composables
        icon: i-lucide-database
        to: /composables
      - label: Components
        icon: i-lucide-box
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

Use the `trailing-icon` prop to customize the trailing [Icon](/components/icon) of each item. Defaults to `i-lucide-chevron-down`. This icon is only displayed when an item has children.

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
  trailingIcon: 'i-lucide-arrow-down'
  items:
    - label: Guide
      icon: i-lucide-book-open
      to: /getting-started
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-lucide-house
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-lucide-cloud-download
        - label: 'Icons'
          icon: 'i-lucide-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        - label: 'Colors'
          icon: 'i-lucide-swatch-book'
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-lucide-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-lucide-database
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-lucide-file-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useOverlay
          icon: i-lucide-file-text
          description: Display a modal/slideover within your application.
          to: /composables/use-overlay
        - label: useToast
          icon: i-lucide-file-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-lucide-box
      to: /components
      active: true
      children:
        - label: Link
          icon: i-lucide-file-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-lucide-file-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-lucide-file-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-lucide-file-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-lucide-file-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-lucide-file-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
  class: 'w-full justify-center'
---
::

::framework-only
#nuxt
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronDown` key.
:::
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
      icon: i-lucide-book-open
      to: /getting-started
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-lucide-house
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-lucide-cloud-download
        - label: 'Icons'
          icon: 'i-lucide-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        - label: 'Colors'
          icon: 'i-lucide-swatch-book'
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-lucide-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-lucide-database
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-lucide-file-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useOverlay
          icon: i-lucide-file-text
          description: Display a modal/slideover within your application.
          to: /composables/use-overlay
        - label: useToast
          icon: i-lucide-file-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-lucide-box
      to: /components
      active: true
      children:
        - label: Link
          icon: i-lucide-file-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-lucide-file-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-lucide-file-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-lucide-file-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-lucide-file-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-lucide-file-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
  class: 'w-full justify-center'
---
::

::note
The arrow is animated to follow the active item.
::

### Content Orientation

Use the `content-orientation` prop to change the orientation of the content.

::warning
This prop only works when `orientation` is `horizontal`.
::

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
  contentOrientation: 'vertical'
  items:
    - label: Guide
      icon: i-lucide-book-open
      to: /getting-started
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-lucide-house
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-lucide-cloud-download
        - label: 'Icons'
          icon: 'i-lucide-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
    - label: Composables
      icon: i-lucide-database
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-lucide-file-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useOverlay
          icon: i-lucide-file-text
          description: Display a modal/slideover within your application.
          to: /composables/use-overlay
        - label: useToast
          icon: i-lucide-file-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-lucide-box
      to: /components
      active: true
      children:
        - label: Link
          icon: i-lucide-file-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-lucide-file-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-lucide-file-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-lucide-file-text
          description: Display a list of pages.
          to: /components/pagination
  class: 'w-full justify-center'
---
::

### Unmount

Use the `unmount-on-hide` prop to control the content unmounting behavior. Defaults to `true`.

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
  unmountOnHide: false
  items:
    - label: Guide
      icon: i-lucide-book-open
      to: /getting-started
      children:
        - label: Introduction
          description: Fully styled and customizable components for Nuxt.
          icon: i-lucide-house
        - label: Installation
          description: Learn how to install and configure Nuxt UI in your application.
          icon: i-lucide-cloud-download
        - label: 'Icons'
          icon: 'i-lucide-smile'
          description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
        - label: 'Colors'
          icon: 'i-lucide-swatch-book'
          description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
        - label: 'Theme'
          icon: 'i-lucide-cog'
          description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
    - label: Composables
      icon: i-lucide-database
      to: /composables
      children:
        - label: defineShortcuts
          icon: i-lucide-file-text
          description: Define shortcuts for your application.
          to: /composables/define-shortcuts
        - label: useOverlay
          icon: i-lucide-file-text
          description: Display a modal/slideover within your application.
          to: /composables/use-overlay
        - label: useToast
          icon: i-lucide-file-text
          description: Display a toast within your application.
          to: /composables/use-toast
    - label: Components
      icon: i-lucide-box
      to: /components
      active: true
      children:
        - label: Link
          icon: i-lucide-file-text
          description: Use NuxtLink with superpowers.
          to: /components/link
        - label: Modal
          icon: i-lucide-file-text
          description: Display a modal within your application.
          to: /components/modal
        - label: NavigationMenu
          icon: i-lucide-file-text
          description: Display a list of links.
          to: /components/navigation-menu
        - label: Pagination
          icon: i-lucide-file-text
          description: Display a list of pages.
          to: /components/pagination
        - label: Popover
          icon: i-lucide-file-text
          description: Display a non-modal dialog that floats around a trigger element.
          to: /components/popover
        - label: Progress
          icon: i-lucide-file-text
          description: Show a horizontal bar to indicate task progression.
          to: /components/progress
  class: 'w-full justify-center'
---
::

::note
You can inspect the DOM to see each item's content being rendered.
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
In this example, leveraging [`defineShortcuts`](/composables/define-shortcuts), you can switch the active item by pressing :kbd{value="1"}, :kbd{value="2"}, or :kbd{value="3"}.
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
- `#{{ item.slot }}-content`{lang="ts-type"}

::component-example
---
name: 'navigation-menu-custom-slot-example'
---
::

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label`, `#item-trailing` and `#item-content` slots to customize all items.
::

### With content slot

Use the `#item-content` slot or the `slot` property (`#{{ item.slot }}-content`) to customize the content of a specific item.

::component-example
---
name: 'navigation-menu-content-slot-example'
---
::

::note
In this example, we add the `sm:w-(--reka-navigation-menu-viewport-width)` class on the `viewport` to have a dynamic width. This requires to set a width on the content's first child.
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
