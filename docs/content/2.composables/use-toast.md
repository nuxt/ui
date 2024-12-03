---
title: useToast
description: 'A composable to display toast notifications in your app.'
---

## Usage

Use the auto-imported `useToast` composable to display [Toast](/components/toast) notifications.

```vue
<script setup lang="ts">
const toast = useToast()
</script>
```

- The `useToast` composable uses Nuxt's `useState` to manage the toast state, ensuring reactivity across your application.
- A maximum of 5 toasts are displayed at a time. When adding a new toast that would exceed this limit, the oldest toast is automatically removed.
- When removing a toast, there's a 200ms delay before it's actually removed from the state, allowing for exit animations.

::warning
Make sure to wrap your app with the [`App`](/components/app) component which uses our [`Toaster`](https://github.com/nuxt/ui/blob/v3/src/runtime/components/Toaster.vue) component which uses the [`ToastProvider`](https://reka-ui.com/docs/components/toast#provider) component from Reka UI.
::

::tip{to="/components/toast"}
Learn how to customize the appearance and behavior of toasts in the **Toast** component documentation.
::

## API

### `add(toast: Partial<Toast>): Toast`

Adds a new toast notification.

- Parameters:
  - `toast`: A partial `Toast` object with the following properties:
    - `id` (optional): A unique identifier for the toast. If not provided, a timestamp will be used.
    - `open` (optional): Whether the toast is open. Defaults to `true`.
    - Other properties from the `Toast` interface.
- Returns: The complete `Toast` object that was added.

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

### `update(id: string | number, toast: Partial<Toast>)`

Updates an existing toast notification.

- Parameters:
  - `id`: The unique identifier of the toast to update.
  - `toast`: A partial `Toast` object with the properties to update.

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

### `remove(id: string | number)`

Removes a toast notification.

- Parameters:
  - `id`: The unique identifier of the toast to remove.

```vue
<script setup lang="ts">
const toast = useToast()

function removeToast(id: string | number) {
  toast.remove(id)
}
</script>
```

### `clear()`

Removes all toast notifications.

```vue
<script setup lang="ts">
const toast = useToast()

function clearAllToasts() {
  toast.clear()
}
</script>
```

### `toasts`

- Type: `Ref<Toast[]>`
- Description: A reactive array containing all current toast notifications.
