---
title: Banner
description: 'Display a banner at the top of your website to inform users about important information.'
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Banner.vue
---

## Usage

### Title

Use the `title` prop to display a title on the Banner.

::component-code
---
prettier: true
class: '!p-0'
props:
  title: 'This is a banner with an important message.'
---
::

### Icon

Use the `icon` prop to display an icon on the Banner.

::component-code
---
prettier: true
class: '!p-0'
ignore:
  - title
props:
  icon: i-lucide-info
  title: 'This is a banner with an icon.'
---
::

### Color

Use the `color` prop to change the color of the Banner.

::component-code
---
prettier: true
class: '!p-0'
ignore:
  - icon
  - title
props:
  color: 'neutral'
  icon: i-lucide-info
  title: 'This is a banner with an icon.'
---
::

### Close

Use the `close` prop to display a [Button](/docs/components/button) to dismiss the Banner. Defaults to `false`.

::tip
A `close` event will be emitted when the close button is clicked.
::

::component-example
---
iframe:
  style: 'height: 48px;'
overflowHidden: true
name: 'banner-example'
---
#code

```vue
<template>
  <UBanner id="example" title="This is a closable banner." close />
</template>
```

::

::note
When closed, `banner-${id}` will be stored in the local storage to prevent it from being displayed again. :br For the example above, `banner-example` will be stored in the local storage.
::

::caution
To persist the dismissed state across page reloads, you must specify an `id` prop. Without an explicit `id`, the banner will only be hidden for the current session and will reappear on page reload.
::

### Close Icon

Use the `close-icon` prop to customize the close button [Icon](/docs/components/icon). Defaults to `i-lucide-x`.

::component-example
---
iframe:
  style: 'height: 48px;'
overflowHidden: true
name: 'banner-example'
props:
  title: 'This is a closable banner with a custom close icon.'
  closeIcon: 'i-lucide-x-circle'
---
#code

```vue
<template>
  <UBanner
    title="This is a closable banner with a custom close icon."
    close
    close-icon="i-lucide-x-circle"
  />
</template>
```

::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Actions

Use the `actions` prop to add some [Button](/docs/components/button) actions to the Banner.

::component-code
---
prettier: true
class: '!p-0'
ignore:
  - title
  - actions
  - variant
external:
  - actions
externalTypes:
  - ButtonProps[]
props:
  title: 'This is a banner with actions.'
  actions:
    - label: Action 1
      variant: outline
    - label: Action 2
      trailingIcon: i-lucide-arrow-right
---
::

::note
The action buttons default to `color="neutral"` and `size="xs"`. You can customize these values by passing them directly to each action button.
::

### Link

You can pass any property from the [`<NuxtLink>`](https://nuxt.com/docs/api/components/nuxt-link) component such as `to`, `target`, `rel`, etc.

::component-code
---
prettier: true
class: '!p-0'
overflowHidden: true
ignore:
  - title
  - target
props:
  to: 'https://nuxtlabs.com/'
  target: '_blank'
  title: 'NuxtLabs is joining Vercel!'
  color: 'primary'
---
::

::note
The `NuxtLink` component will inherit all other attributes you pass to the `User` component.
::

## Examples

### Within `app.vue`

Use the Banner component in your `app.vue` or in a layout:

```vue [app.vue]{3}
<template>
  <UApp>
    <UBanner icon="i-lucide-construction" title="Nuxt UI v4 has been released!" />

    <UHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
