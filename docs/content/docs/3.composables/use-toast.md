---
title: useToast
description: 'A composable to display toast notifications in your app.'
---

## Usage

Use the auto-imported `useToast` composable to display [Toast](/docs/components/toast) notifications.

```vue
<script setup lang="ts">
const toast = useToast()
</script>
```

- The `useToast` composable uses Nuxt's `useState` to manage the toast state, ensuring reactivity across your application.
- A maximum of 5 toasts are displayed at a time. When adding a new toast that would exceed this limit, the oldest toast is automatically removed.
- When removing a toast, there's a 200ms delay before it's actually removed from the state, allowing for exit animations.

::warning
Make sure to wrap your app with the [`App`](/docs/components/app) component which uses our [`Toaster`](https://github.com/nuxt/ui/blob/v4/src/runtime/components/Toaster.vue) component which uses the [`ToastProvider`](https://reka-ui.com/docs/components/toast#provider) component from Reka UI.
::

::tip{to="/docs/components/toast"}
Learn how to customize the appearance and behavior of toasts in the **Toast** component documentation.
::

## API

`useToast()`{lang="ts-type"}

The `useToast` composable provides methods to manage toast notifications globally.

### add()

`add(toast: Partial<Toast>): Toast`{lang="ts-type"}

Adds a new toast notification.

#### Parameters

::field-group
  ::field{name="toast" type="Partial<Toast>" required}
  A partial `Toast` object with the following properties:

  ::collapsible
    ::field-group
      ::field{name="id" type="string | number"}
      A unique identifier for the toast. If not provided, a timestamp will be used.
      ::

      ::field{name="open" type="boolean"}
      Whether the toast is open. Defaults to `true`.
      ::

      ::field{name="title" type="string"}
      The title displayed in the toast.
      ::

      ::field{name="description" type="string"}
      The description displayed in the toast.
      ::

      ::field{name="icon" type="string"}
      The icon displayed in the toast.
      ::

      ::field{name="avatar" type="AvatarProps"}
      The avatar displayed in the toast. See [Avatar](/docs/components/avatar#props).
      ::

      ::field{name="color" type="string"}
      The color of the toast.
      ::

      ::field{name="orientation" type="'horizontal' | 'vertical'"}
      The orientation between the content and the actions. Defaults to `vertical`.
      ::

      ::field{name="close" type="boolean | ButtonProps"}
      Customize or hide the close button (with `false` value). Defaults to `true`.
      ::

      ::field{name="closeIcon" type="string"}
      The icon displayed in the close button.
      ::

      ::field{name="actions" type="ButtonProps[]"}
      The actions displayed in the toast. See [Button](/docs/components/button#props).
      ::

      ::field{name="progress" type="boolean | ProgressProps"}
      Customize or hide the progress bar (with `false` value). Defaults to `true`.
      ::

      ::field{name="duration" type="number"}
      The duration in milliseconds before the toast auto-closes. Can also be set globally on the [`App`](/docs/components/app) component.
      ::

      ::field{name="onClick" type="(toast: Toast) => void"}
      A callback function invoked when the toast is clicked.
      ::

      ::field{name="onUpdateOpen" type="(open: boolean) => void"}
      A callback function invoked when the toast open state changes. Useful to perform an action when the toast closes (expired or dismissed).
      ::
    ::
  ::
  ::
::

**Returns:** The complete `Toast` object that was added.

```vue
<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    title: 'Success',
    description: 'Your action was completed successfully.',
    color: 'success'
  })
}
</script>
```

### update()

`update(id: string | number, toast: Partial<Toast>): void`{lang="ts-type"}

Updates an existing toast notification.

#### Parameters

::field-group
  ::field{name="id" type="string | number" required}
  The unique identifier of the toast to update.
  ::

  ::field{name="toast" type="Partial<Toast>" required}
  A partial `Toast` object with the properties to update.
  ::
::

```vue
<script setup lang="ts">
const toast = useToast()

function updateToast(id: string | number) {
  toast.update(id, {
    title: 'Updated Toast',
    description: 'This toast has been updated.'
  })
}
</script>
```

### remove()

`remove(id: string | number): void`{lang="ts-type"}

Removes a toast notification.

#### Parameters

::field-group
  ::field{name="id" type="string | number" required}
  The unique identifier of the toast to remove.
  ::
::

```vue
<script setup lang="ts">
const toast = useToast()

function removeToast(id: string | number) {
  toast.remove(id)
}
</script>
```

### clear()

`clear(): void`{lang="ts-type"}

Removes all toast notifications.

```vue
<script setup lang="ts">
const toast = useToast()

function clearAllToasts() {
  toast.clear()
}
</script>
```

### toasts

`toasts: Ref<Toast[]>`{lang="ts-type"}

A reactive array containing all current toast notifications.

```vue
<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div>
    <pre>{{ toasts }}</pre>
  </div>
</template>
```
