---
title: useOverlay
description: "A composable to programmatically control overlays."
---

## Usage

Use the auto-imported `useOverlay` composable to programmatically control [Modal](/components/modal) and [Slideover](/components/slideover) components.

```vue
<script setup lang="ts">
const overlay = useOverlay()

const modal = overlay.create(MyModal)

async function openModal() {
  modal.open()
}
</script>
```

- The `useOverlay` composable is created using `createSharedComposable`, ensuring that the same overlay state is shared across your entire application.

::note
In order to return a value from the overlay, the `overlay.open()` can be awaited. In order for this to work, however, the **overlay component must emit a `close` event**. See example below for details.
::

## API

### `create(component: T, options: OverlayOptions): OverlayInstance`

Creates an overlay, and returns its instance

- Parameters:
  - `component`: The overlay component
  - `options` The overlay options
    - `defaultOpen?: boolean` Opens the overlay immediately after being created `default: false`
    - `props?: ComponentProps`: An optional object of props to pass to the rendered component.
    - `destroyOnClose?: boolean` Removes the overlay from memory when closed `default: false`

### `open(id: symbol, props?: ComponentProps<T>): Promise<any>`

Opens the overlay using its `id`

- Parameters:
  - `id`: The identifier of the overlay
  - `props`: An optional object of props to pass to the rendered component.

### `close(id: symbol, value?: any): void`

Close an overlay using its `id`

- Parameters:
  - `id`: The identifier of the overlay
  - `value`: A value to resolve the overlay promise with

### `patch(id: symbol, props: ComponentProps<T>): void`

Update an overlay using its `id`

- Parameters:
  - `id`: The identifier of the overlay
  - `props`: An object of props to update on the rendered component.

### `unmount(id: symbol): void`

Removes the overlay from the DOM using its `id`

- Parameters:
  - `id`: The identifier of the overlay

### `overlays: Overlay[]`

In-memory list of overlays that were created

## Overlay Instance API

### `open(props?: ComponentProps<T>): Promise<any>`

Opens the overlay

- Parameters:
  - `props`: An optional object of props to pass to the rendered component.

```vue
<script setup lang="ts">
const overlay = useOverlay()

const modal = overlay.create(MyModalContent)

function openModal() {
  modal.open({
    title: 'Welcome'
  })
}
</script>
```

### `close(value?: any): void`

Close the overlay

- Parameters:
  - `value`: A value to resolve the overlay promise with

### `patch(props: ComponentProps<T>)`

Updates the props of the overlay.

- Parameters:
  - `props`: An object of props to update on the rendered component.

```vue
<script setup lang="ts">
const overlay = useOverlay()

const modal = overlay.create(MyModal, {
  title: 'Welcome'
})

function openModal() {
  modal.open()
}

function updateModalTitle() {
  modal.patch({ title: 'Updated Title' })
}
</script>
```

## Example

Here's a complete example of how to use the `useOverlay` composable:

```vue
<script setup lang="ts">
const overlay = useOverlay()

// Create with default props
const modalA = overlay.create(ModalA, { title: 'Welcome' })
const modalB = overlay.create(modalB)

const slideoverA = overlay.create(SlideoverA)

const openModalA = () => {
  // Open  Modal A, but override the title prop
  modalA.open({ title: 'Hello' })
}

const openModalB = async () => {
  // Open modalB, and wait for its result
  const input = await modalB.open()

  // Pass the result from modalB to the slideover, and open it.
  slideoverA.open({ input })
}
</script>

<template>
  <div>
    <button @click="openModal">Open Modal</button>
  </div>
</template>
```

In this example, we're using the `useOverlay` composable to control multiple modals and slideovers.
