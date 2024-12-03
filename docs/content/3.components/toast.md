---
description: A succinct message to provide information or feedback to the user.
links:
  - label: Toast
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/toast
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Toast.vue
---

## Usage

Use the [useToast](/composables/use-toast) composable to display a toast in your application.

::warning
Make sure to wrap your app with the [`App`](/components/app) component which uses our [`Toaster`](https://github.com/nuxt/ui/blob/v3/src/runtime/components/Toaster.vue) component which uses the [`ToastProvider`](https://reka-ui.com/docs/components/toast#provider) component from Reka UI.
::

::tip{to="/components/app#props"}
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

Pass an `icon` field to the `toast.add` method to display an [Icon](/components/icon).

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

Pass an `avatar` field to the `toast.add` method to display an [Avatar](/components/avatar).

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

Pass a `close` field to customize or hide the close button (with `false` value).

::component-example
---
name: 'toast-close-example'
---
::

### Close Icon

Pass a `closeIcon` field to customize the close button [Icon](/components/icon). Default to `i-lucide-x`.

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
:::tip{to="/getting-started/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.close` key.
:::

#vue
:::tip{to="/getting-started/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.close` key.
:::
::

### Actions

Pass an `actions` field to add some [Button](/components/button) actions to the Alert.

::component-example
---
options:
  - name: 'description'
    label: 'description'
    default: 'There was a problem with your request.'
name: 'toast-actions-example'
---
::

::note
Actions renders differently when the description is not set. You can try to remove it.
::

## Examples

### Change global position

Change the `toaster.position` prop on the [App](/components/app#props) component to change the position of the toasts.

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-position-example
::

::note{to="https://github.com/nuxt/ui/blob/v3/docs/app/app.vue#L77"}
In this example, we use the `AppConfig` to configure the `position` prop of the `Toaster` component globally.
::

### Change global duration

Change the `toaster.duration` prop on the [App](/components/app#props) component to change the duration of the toasts.

::component-example
---
prettier: true
name: 'toast-example'
---

#options
:toaster-duration-example
::

::note{to="https://github.com/nuxt/ui/blob/v3/docs/app/app.vue#L77"}
In this example, we use the `AppConfig` to configure the `duration` prop of the `Toaster` component globally.
::

### Stacked toasts

Set the `toaster.expand` prop to `false` on the [App](/components/app#props) component to display stacked toasts.

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

::note{to="https://github.com/nuxt/ui/blob/v3/docs/app/app.vue#L77"}
In this example, we use the `AppConfig` to configure the `expand` prop of the `Toaster` component globally.
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
