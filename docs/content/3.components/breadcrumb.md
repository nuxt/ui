---
description: A hierarchy of links to navigate through a website.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Breadcrumb.vue
---

## Usage

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)

You can also pass any property from [NuxtLink](https://nuxt.com/docs/api/components/nuxt-link#props) component such as `to`, `target`, etc.

::component-code
---
ignore:
  - items
external:
  - items
props:
  items:
    - label: 'Home'
      icon: 'i-heroicons-home'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      to: '/components'
    - label: 'Breadcrumb'
      icon: 'i-heroicons-link'
      to: '/components/breadcrumb'
---
::

::note
A `span` will be rendered instead of a link when the `to` property is not defined.
::

### Separator

Use the `separator-icon` prop to customize the [Icon](/components/icon) between each item. Defaults to `i-heroicons-chevron-right-20-solid`.

::component-code
---
ignore:
  - items
external:
  - items
props:
  separatorIcon: 'i-heroicons-arrow-right-20-solid'
  items:
    - label: 'Home'
      icon: 'i-heroicons-home'
    - label: 'Components'
      icon: 'i-heroicons-cube-transparent'
      to: '/components'
    - label: 'Breadcrumb'
      icon: 'i-heroicons-link'
      to: '/components/breadcrumb'
---
::

::tip
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronRight` key.
::

## Examples

### With custom slot

Use the `slot` property to customize a specific item with a dropdown menu for example.

:component-example{name="breadcrumb-custom-slot-example"}

### With separator slot

Use the `#separator` slot to customize the separator between each item.

:component-example{name="breadcrumb-separator-slot-example"}

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
