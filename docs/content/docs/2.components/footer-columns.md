---
title: FooterColumns
description: 'A list of links as columns to display in your Footer.'
category: navigation
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/FooterColumns.vue
---

## Usage

The FooterColumns component renders a list of columns to display in your Footer.

Use it in the `top` slot of the [Footer](/docs/components/footer) component:

```vue {3-7}
<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns />
      </UContainer>
    </template>
  </UFooter>
</template>
```

### Columns

Use the `columns` prop as an array of objects with the following properties:

- `label: string`{lang="ts-type"}
- `children?: FooterColumnLink[]`{lang="ts-type"}

Each column contains a `children` array of objects that define the links. Each link can have the following properties:

- `label?: string`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, link?: ClassNameValue, linkLabel?: ClassNameValue, linkLabelExternalIcon?: ClassNameValue, linkLeadingIcon?: ClassNameValue }`{lang="ts-type"}

You can pass any property from the [Link](/docs/components/link#props) component such as `to`, `target`, etc.

::component-example
---
prettier: true
name: 'footer-columns-example'
class: 'p-8'
props:
  class: 'w-full'
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
