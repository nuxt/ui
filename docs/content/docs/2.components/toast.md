---
description: A succinct message to provide information or feedback to the user.
category: overlay
links:
  - label: Toast
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/toast
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Toast.vue
---

## Usage

Use the [useToast](/docs/composables/use-toast) composable to display a toast in your application.

::component-example
---
collapse: true
prettier: true
name: 'toast-example'
---
::

::warning
Make sure to wrap your app with the [`App`](/docs/components/app) component which uses our [`Toaster`](https://github.com/nuxt/ui/blob/v4/src/runtime/components/Toaster.vue) component which uses the [`ToastProvider`](https://reka-ui.com/docs/components/toast#provider) component from Reka UI.
::

::tip{to="/docs/components/app#props"}
You can check the `App` component `toaster` prop to see how to configure the Toaster globally.
::

### Title

Pass a `title` field to the `toast.add` method to display a title.

::component-example
---
options:
  - name: 'title'
    label: 'title'
    default: 'Uh oh! Something went wrong.'
name: 'toast-title-example'
---
::

### Description

Pass a `description` field to the `toast.add` method to display a description.

::component-example
---
options:
  - name: 'title'
    label: 'title'
    default: 'Uh oh! Something went wrong.'
  - name: 'description'
    label: 'description'
    default: 'There was a problem with your request.'
name: 'toast-description-example'
---
::

### Icon

Pass an `icon` field to the `toast.add` method to display an [Icon](/docs/components/icon).

::component-example
---
options:
  - name: 'icon'
    label: 'icon'
    default: 'i-lucide-wifi'
name: 'toast-icon-example'
---
::

### Avatar

Pass an `avatar` field to the `toast.add` method to display an [Avatar](/docs/components/avatar).

::component-example
---
options:
  - name: 'avatar.src'
    alias: 'avatar'
    label: 'avatar.src'
    default:
      src: 'https://github.com/benjamincanac.png'
name: 'toast-avatar-example'
---
::

### Color

Pass a `color` field to the `toast.add` method to change the color of the Toast.

::component-example
---
options:
  - name: 'color'
    label: 'color'
    default: neutral
    items:
      - primary
      - secondary
      - success
      - info
      - warning
      - error
      - neutral
name: 'toast-color-example'
---
::

### Close

Pass a `close` field to customize or hide the close [Button](/docs/components/button) (with `false` value).

::component-example
---
name: 'toast-close-example'
---
::

### Close Icon

Pass a `closeIcon` field to customize the close button [Icon](/docs/components/icon). Default to `i-lucide-x`.

::component-example
---
options:
  - name: 'closeIcon'
    label: 'closeIcon'
    default: 'i-lucide-arrow-right'
name: 'toast-close-icon-example'
---
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

Pass an `actions` field to add some [Button](/docs/components/button) actions to the Toast.

::component-example
---
options:
  - name: 'description'
    label: 'description'
    default: 'There was a problem with your request.'
name: 'toast-actions-example'
---
::

### Progress

Pass a `progress` field to customize or hide the [Progress](/docs/components/progress) bar (with `false` value).

::tip
The Progress bar inherits the Toast color by default, but you can override it using the `progress.color` field.
::

::component-example
---
name: 'toast-progress-example'
---
::

### Orientation

Pass an `orientation` field to the `toast.add` method to change the orientation of the Toast.

::component-example
---
options:
  - name: 'orientation'
    label: 'orientation'
    default: 'horizontal'
    items:
      - horizontal
      - vertical
name: 'toast-orientation-example'
---
::

## Examples

::note{to="/components/app"}
Nuxt UI provides an **App** component that wraps your app to provide global configurations.
::

### Change global position

Change the `toaster.position` prop on the [App](/docs/components/app#props) component to change the position of the toasts.

```vue [app.vue]
<script setup lang="ts">
const toaster = { position: 'bottom-right' }
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
```

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-position-example
::

::note{to="https://github.com/nuxt/ui/blob/v4/docs/app/app.config.ts#L3"}
In this example, we use the `AppConfig` to configure the `position` prop of the `Toaster` component globally.
::

### Change global duration

Change the `toaster.duration` prop on the [App](/docs/components/app#props) component to change the duration of the toasts.

```vue [app.vue]
<script setup lang="ts">
const toaster = { duration: 5000 }
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
```

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-duration-example
::

::note{to="https://github.com/nuxt/ui/blob/v4/docs/app/app.config.ts#L4"}
In this example, we use the `AppConfig` to configure the `duration` prop of the `Toaster` component globally.
::

### Change global max :badge{label="4.1+" class="align-text-top"}

Change the `toaster.max` prop on the [App](/docs/components/app#props) component to change the max number of toasts displayed at once.

```vue [app.vue]
<script setup lang="ts">
const toaster = { max: 3 }
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
```

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-max-example
::

::note{to="https://github.com/nuxt/ui/blob/v4/docs/app/app.config.ts#L5"}
In this example, we use the `AppConfig` to configure the `max` prop of the `Toaster` component globally.
::

### Stacked toasts

Set the `toaster.expand` prop to `false` on the [App](/docs/components/app#props) component to display stacked toasts (inspired by [Sonner](https://sonner.emilkowal.ski/)).

```vue [app.vue]
<script setup lang="ts">
const toaster = { expand: true }
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtPage />
  </UApp>
</template>
```

::tip
You can hover over the toasts to expand them. This will also pause the timer of the toasts.
::

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-expand-example
::

::note{to="https://github.com/nuxt/ui/blob/v4/docs/app/app.config.ts#L6"}
In this example, we use the `AppConfig` to configure the `expand` prop of the `Toaster` component globally.
::

### Deduplicated toasts :badge{label="Soon" class="align-text-top"}

When calling `toast.add` with an `id` that already exists, the existing toast will pulse instead of creating a duplicate.

::component-example
---
collapse: true
name: 'toast-duplicate-example'
---
::

### With callback

Pass an `onUpdateOpen` field to execute a callback when the toast is closed (either by expiration or user dismissal).

::component-example
---
collapse: true
name: 'toast-callback-example'
---
::

### With HTML content

Use the [`h()` render function](https://vuejs.org/api/render-function.html#h) in the `title` or `description` fields to render HTML elements or Vue components with custom styling.

::component-example
---
collapse: true
name: 'toast-html-example'
---
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `height`{lang="ts-type"} | `Ref<number>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
