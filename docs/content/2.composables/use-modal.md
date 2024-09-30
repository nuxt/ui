---
title: useModal
description: 'A composable to programmatically control a Modal component.'
---

## Usage

Use the auto-imported `useModal` composable to programmatically control a [Modal](/components/modal) component.

```vue
<script setup lang="ts">
const modal = useModal()
</script>
```

- The `useModal` composable is created using `createSharedComposable`, ensuring that the same modal state is shared across your entire application.

::tip{to="/components/modal"}
Learn how to customize the appearance and behavior of modals in the **Modal** component documentation.
::

## API

### `open(component: Component, props?: ModalProps & ComponentProps<T>)`

Opens a modal with the specified component and props.

- Parameters:
  - `component`: The Vue component to render inside the modal.
  - `props`: An optional object of props to pass to both the Modal and the rendered component.

```vue
<script setup lang="ts">
const modal = useModal()

function openModal() {
  modal.open(MyModalContent, { title: 'Welcome' })
}
</script>
```

### `close()`

Closes the currently open modal.

```vue
<script setup lang="ts">
const modal = useModal()

async function closeModal() {
  await modal.close()
}
</script>
```

### `reset()`

Resets the modal state to its default values.

```vue
<script setup lang="ts">
const modal = useModal()

function resetModal() {
  modal.reset()
}
</script>
```

### `patch(props: Partial<ModalProps & ComponentProps<T>>)`

Updates the props of the currently open modal.

```vue
<script setup lang="ts">
const modal = useModal()

function updateModalTitle() {
  modal.patch({ title: 'Updated Title' })
}
</script>
```

## Example

Here's a complete example of how to use the `useModal` composable:

```vue
<template>
  <div>
    <button @click="openModal">Open Modal</button>
    <button @click="closeModal">Close Modal</button>
    <button @click="updateModalTitle">Update Title</button>
  </div>
</template>

<script setup lang="ts">
const modal = useModal()

const openModal = () => {
  modal.open(MyModalContent, { title: 'Welcome' })
}

const closeModal = async () => {
  await modal.close()
}

const updateModalTitle = () => {
  modal.patch({ title: 'Updated Welcome' })
}
</script>
```

In this example, we're using the `useModal` composable to control a modal. We can open it with a specific component and props, close it, and update its props.
