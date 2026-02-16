---
description: A hierarchy of links to navigate through a website.
category: navigation
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Breadcrumb.vue
---

## Usage

Use the Breadcrumb component to show the current page's location in your site's hierarchy.

::component-code
---
collapse: true
ignore:
  - items
external:
  - items
externalTypes:
  - BreadcrumbItem[]
props:
  items:
    - label: 'Docs'
      icon: 'i-lucide-book-open'
      to: '/docs'
    - label: 'Components'
      icon: 'i-lucide-box'
      to: '/docs/components'
    - label: 'Breadcrumb'
      icon: 'i-lucide-link'
      to: '/docs/components/breadcrumb'
---
::

### Items

Use the `items` prop as an array of objects with the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, link?: ClassNameValue, linkLeadingIcon?: ClassNameValue, linkLeadingAvatar?: ClassNameValue, linkLabel?: ClassNameValue, separator?: ClassNameValue, separatorIcon?: ClassNameValue }`{lang="ts-type"}

You can pass any property from the [Link](/docs/components/link#props) component such as `to`, `target`, etc.

::component-code
---
ignore:
  - items
external:
  - items
externalTypes:
  - BreadcrumbItem[]
props:
  items:
    - label: 'Docs'
      icon: 'i-lucide-book-open'
      to: '/docs'
    - label: 'Components'
      icon: 'i-lucide-box'
      to: '/docs/components'
    - label: 'Breadcrumb'
      icon: 'i-lucide-link'
      to: '/docs/components/breadcrumb'
---
::

::note
A `span` is rendered instead of a link when the `to` property is not defined.
::

### Separator Icon

Use the `separator-icon` prop to customize the [Icon](/docs/components/icon) between each item. Defaults to `i-lucide-chevron-right`.

::component-code
---
ignore:
  - items
external:
  - items
externalTypes:
  - BreadcrumbItem[]
props:
  separatorIcon: 'i-lucide-arrow-right'
  items:
    - label: 'Docs'
      icon: 'i-lucide-book-open'
      to: '/docs'
    - label: 'Components'
      icon: 'i-lucide-box'
      to: '/docs/components'
    - label: 'Breadcrumb'
      icon: 'i-lucide-link'
      to: '/docs/components/breadcrumb'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronRight` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronRight` key.
:::
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

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
