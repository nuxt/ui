---
description: A hierarchy of links to navigate through a website.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Breadcrumb.vue
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)

You can also pass any property from the [Link](/components/link#props) component such as `to`, `target`, etc.

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
A `span` is rendered instead of a link when the `to` property is not defined.
::

### Separator Icon

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

::tip{to="/getting-started/icons#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronRight` key.
::

## Examples

### With separator slot

Use the `#separator` slot to customize the separator between each item.

:component-example{name="breadcrumb-separator-slot-example"}

### With custom slot

Use the `slot` property to customize a specific item.

You will have access to the following slots:

- `#{{ item.slot }}`{lang="ts-type"}
- `#{{ item.slot }}-leading`{lang="ts-type"}
- `#{{ item.slot }}-label`{lang="ts-type"}
- `#{{ item.slot }}-trailing`{lang="ts-type"}

:component-example{name="breadcrumb-custom-slot-example"}

::tip{to="#slots"}
You can also use the `#item`, `#item-leading`, `#item-label` and `#item-trailing` slots to customize all items.
::

## API

### Props

::component-props
---
ignore:
  - as
  - to
  - target
  - active
  - activeClass
  - inactiveClass
  - exactActiveClass
  - ariaCurrentValue
  - href
  - rel
  - noRel
  - prefetch
  - prefetchOn
  - noPrefetch
  - prefetchedClass
  - replace
  - exact
  - exactQuery
  - exactHash
  - external
---
::

### Slots

:component-slots

## Theme

:component-theme
