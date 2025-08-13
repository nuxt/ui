---
title: Error
description: 'A pre-built error component with NuxtError support.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Error.vue
---

## Usage

Like the [Main](/docs/components/main) component, the Error component renders a `<main>` element that works together with the [Header](/docs/components/header) component to create a full-height layout that extends to the viewport's available height.

::note
The Header component defines its height through a `--ui-header-height` CSS variable, which you can customize by overriding it in your CSS:

```css
:root {
  --ui-header-height: --spacing(16);
}
```

::

### Error

Use the `error` prop to display an error message.

::note{to="https://nuxt.com/docs/guide/directory-structure/error" target="_blank"}
In most cases, you will receive the `error` prop in your `error.vue` file.
::

::component-code
---
hide:
  - class
prettier: true
props:
  error:
    statusCode: 404
    statusMessage: 'Page not found'
    message: 'The page you are looking for does not exist.'
  class: '!min-h-96'
---
::

### Clear

Use the `clear` prop to customize or hide the clear button (with `false` value).

You can pass any property from the [Button](/docs/components/button) component to customize it.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - error.statusCode
  - error.statusMessage
  - error.message
  - clear.color
  - clear.size
  - clear.icon
  - clear.class
props:
  clear:
    color: neutral
    size: xl
    icon: i-lucide-arrow-left
    class: 'rounded-full'
  error:
    statusCode: 404
    statusMessage: 'Page not found'
    message: 'The page you are looking for does not exist.'
  class: '!min-h-96'
---
::

### Redirect

Use the `redirect` prop to redirect the user to a different page when the clear button is clicked. Defaults to `/`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - error.statusCode
  - error.statusMessage
  - error.message
props:
  redirect: '/docs/getting-started'
  error:
    statusCode: 404
    statusMessage: 'Page not found'
    message: 'The page you are looking for does not exist.'
  class: '!min-h-96'
---
::

## Examples

### Within `error.vue`

Use the Error component in your `error.vue`:

```vue [error.vue]{13}
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <UHeader />

    <UError :error="error" />

    <UFooter />
  </UApp>
</template>
```

::tip
You might want to replicate the code of your `app.vue` inside your `error.vue` file to have the same layout and features, here is an example: <https://github.com/nuxt/ui/blob/v3/docs/app/error.vue>
::

::note
You can read more about how to handle errors in the [Nuxt documentation](https://nuxt.com/docs/getting-started/error-handling#error-page), but when using `nuxt generate` it is recommended to add `fatal: true` inside your `createError` call to make sure the error page is displayed:

```vue [pages/\[...slug\\].vue]
<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>
```

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
