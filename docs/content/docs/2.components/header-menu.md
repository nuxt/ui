---
description: 'The mobile menu of a Header, under it or in an overlay.'
category: layout
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v5/src/runtime/components/HeaderMenu.vue
---

## Usage

Use the HeaderMenu component in the `menu` slot of a [Header](/docs/components/header). The toggle of the Header opens it below `lg`.

::tip{to="/docs/components/header#menu"}
The `body` slot of the Header renders a HeaderMenu with its defaults.
::

```vue
<template>
  <UHeader>
    <template #menu>
      <UHeaderMenu mode="slideover">
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </UHeaderMenu>
    </template>
  </UHeader>
</template>
```

### Mode

Use the `mode` prop to change where the menu opens. Defaults to `inline`.

- `inline` opens it under the header, which stays in place with its toggle. The page under it can't scroll, and the toggle and Escape close it.
- `modal`, `slideover` and `drawer` open it in a fullscreen [Modal](/docs/components/modal), a [Slideover](/docs/components/slideover) or a [Drawer](/docs/components/drawer). The Modal and the Slideover show their own close button.

::component-example
---
collapse: true
iframe:
  height: 300px;
iframeMobile: true
overflowHidden: true
name: 'header-menu-example'
options:
  - name: 'mode'
    label: 'mode'
    default: 'inline'
    items:
      - inline
      - modal
      - slideover
      - drawer
props:
  class: 'w-full'
---
::

### Overlay

Use the `overlay` prop to pass props to the Modal, Slideover or Drawer of the other modes.

```vue
<template>
  <UHeader>
    <template #menu>
      <UHeaderMenu mode="slideover" :overlay="{ side: 'left' }">
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </UHeaderMenu>
    </template>
  </UHeader>
</template>
```

### Content

Use the default slot to fill the body of the menu, or the `content` slot to fill all of it. In `modal` and `slideover` modes, the `content` slot replaces their header too, so add a close of your own with the `close` it receives.

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
