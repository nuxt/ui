---
title: useOverlay
description: 'A composable to programmatically control overlays.'
---

## Usage

Use the auto-imported `useOverlay` composable to programmatically control [Modal](/components/modal) and [Slideover](/components/slideover) components.

```vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyModalExample)

async function openModal() {
  modal.open()
}
</script>
```

- The `useOverlay` composable is created using `createSharedComposable`, ensuring that the same overlay state is shared across your entire application.

::note
In order to return a value from the overlay, the `overlay.open().instance` can be awaited. In order for this to work, however, the **overlay component must emit a `close` event**. See example below for details.
::


## API

### `create(component: T, options: OverlayOptions): OverlayInstance`

Create an overlay, and return a factory instance.

- Parameters:
  - `component`: The overlay component.
  - `options`:
    - `defaultOpen?: boolean` Open the overlay immediately after being created. Defaults to `false`.
    - `props?: ComponentProps`: An optional object of props to pass to the rendered component.
    - `destroyOnClose?: boolean` Removes the overlay from memory when closed. Defaults to `false`.

### `open(id: symbol, props?: ComponentProps<T>): OpenedOverlay<T>`

Open an overlay by its `id`.

- Parameters:
  - `id`: The identifier of the overlay.
  - `props`: An optional object of props to pass to the rendered component.

### `close(id: symbol, value?: any): void`

Close an overlay by its `id`.

- Parameters:
  - `id`: The identifier of the overlay.
  - `value`: A value to resolve the overlay promise with.

### `patch(id: symbol, props: ComponentProps<T>): void`

Update an overlay by its `id`.

- Parameters:
  - `id`: The identifier of the overlay.
  - `props`: An object of props to update on the rendered component.

### `unmount(id: symbol): void`

Remove an overlay from the DOM by its `id`.

- Parameters:
  - `id`: The identifier of the overlay.

### `isOpen(id: symbol): boolean`

Check if an overlay is open using its `id`.

- Parameters:
  - `id`: The identifier of the overlay.

### `overlays: Overlay[]`

In-memory list of all overlays that were created.

## Instance API

### `open(props?: ComponentProps<T>): Promise<OpenedOverlay<T>>`

Open the overlay.

- Parameters:
  - `props`: An optional object of props to pass to the rendered component.

```vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyModalExample)

function openModal() {
  modal.open({
    title: 'Welcome'
  })
}
</script>
```

### `close(value?: any): void`

Close the overlay.

- Parameters:
  - `value`: A value to resolve the overlay promise with.

### `patch(props: ComponentProps<T>)`

Update the props of the overlay.

- Parameters:
  - `props`: An object of props to update on the rendered component.

```vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyModalExample, {
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
import { ModalA, ModalB, SlideoverA } from '#components'

const overlay = useOverlay()

// Create with default props
const modalA = overlay.create(ModalA, { title: 'Welcome' })
const modalB = overlay.create(ModalB)

const slideoverA = overlay.create(SlideoverA)

const openModalA = () => {
  // Open modalA, but override the title prop
  modalA.open({ title: 'Hello' })
}

const openModalB = async () => {
  // Open modalB, and wait for its result
  const modalBInstance = modalB.open()

  const input = await modalBInstance

  // Pass the result from modalB to the slideover, and open it
  slideoverA.open({ input })
}
</script>

<template>
  <button @click="openModalA">Open Modal</button>
</template>
```

In this example, we're using the `useOverlay` composable to control multiple modals and slideovers.

## Caveats

### Provide / Inject

When opening overlays programmatically (e.g. modals, slideovers, etc), the overlay component can only access injected values from the component containing `UApp` (typically `app.vue` or layout components). This is because overlays are mounted outside of the page context by the `UApp` component.

As such, using `provide()` in pages or parent components isn't supported directly. To pass provided values to overlays, the recommended approach is to use props instead:

```vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const providedValue = inject('valueProvidedInPage')

const modal = overlay.create(LazyModalExample, {
  props: {
    providedValue,
    otherData: someValue
  }
})
</script>
```