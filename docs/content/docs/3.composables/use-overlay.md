---
title: useOverlay
description: 'A composable to programmatically control overlays.'
---

## Usage

Use the auto-imported `useOverlay` composable to programmatically control [Modal](/docs/components/modal) and [Slideover](/docs/components/slideover) components.

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
In order to return a value from the overlay, the `overlay.open()` can be awaited. In order for this to work, however, the **overlay component must emit a `close` event**. See example below for details.
::


## API

`useOverlay()`{lang="ts-type"}

The `useOverlay` composable provides methods to manage overlays globally. Each created overlay returns an instance with its own methods.

### create()

`create(component: T, options: OverlayOptions): OverlayInstance`{lang="ts-type"}

Create an overlay, and return a factory instance.

#### Parameters

::field-group
  ::field{name="component" type="T" required}
  The overlay component to render.
  ::

  ::field{name="options" type="OverlayOptions"}
  Configuration options for the overlay.

  ::collapsible
    ::field-group
    ::field{name="defaultOpen" type="boolean"}
    Open the overlay immediately after being created. Defaults to `false`.
    ::

    ::field{name="props" type="ComponentProps"}
    An optional object of props to pass to the rendered component.
    ::

    ::field{name="destroyOnClose" type="boolean"}
    Removes the overlay from memory when closed. Defaults to `false`.
    ::
    ::
  ::
  ::
::

### on()

`on(event: string, callback: (value: unknown) => void): void`{lang="ts-type"}

#### Parameters

::field-group
  ::field{name="event" type="string" required}
  The event to listen to.
  ::

  ::field{name="callback" type="(value: unknown) => void" required}
  The callback to invoke when the event is emitted.
  ::
::

::warning
Emits and its callback arguments are infer from component but it's not working for component which have more than 5 emits.
::

### open()

`open(id: symbol, props?: ComponentProps<T>): OpenedOverlay<T>`{lang="ts-type"}

Open an overlay by its `id`.

#### Parameters

::field-group
  ::field{name="id" type="symbol" required}
  The identifier of the overlay.
  ::

  ::field{name="props" type="ComponentProps<T>"}
  An optional object of props to pass to the rendered component.
  ::
::

### close()

`close(id: symbol, value?: any): void`{lang="ts-type"}

Close an overlay by its `id`.

#### Parameters

::field-group
  ::field{name="id" type="symbol" required}
  The identifier of the overlay.
  ::

  ::field{name="value" type="any"}
  A value to resolve the overlay promise with.
  ::
::

### patch()

`patch(id: symbol, props: ComponentProps<T>): void`{lang="ts-type"}

Update an overlay by its `id`.

#### Parameters

::field-group
  ::field{name="id" type="symbol" required}
  The identifier of the overlay.
  ::

  ::field{name="props" type="ComponentProps<T>" required}
  An object of props to update on the rendered component.
  ::
::

### unmount()

`unmount(id: symbol): void`{lang="ts-type"}

Remove an overlay from the DOM by its `id`.

#### Parameters

::field-group
  ::field{name="id" type="symbol" required}
  The identifier of the overlay.
  ::
::

### isOpen()

`isOpen(id: symbol): boolean`{lang="ts-type"}

Check if an overlay is open using its `id`.

#### Parameters

::field-group
  ::field{name="id" type="symbol" required}
  The identifier of the overlay.
  ::
::

### overlays

`overlays: Overlay[]`{lang="ts-type"}

In-memory list of all overlays that were created.

## Instance API

### on()

`on(event: string, callback: (value: unknown) => void): void`{lang="ts-type"}

Listen to overlay's component emits.

#### Parameters

::field-group
  ::field{name="event" type="string" required}
  The event to listen to.
  ::

  ::field{name="callback" type="(value: unknown) => void" required}
  The callback to invoke when the event is emitted.
  ::
::

```vue
<script setup lang="ts">
import { LazyModalExample } from '#components'

const overlay = useOverlay()

const modal = overlay.create(LazyModalExample)
modal.on('event-emitted', () => {
  console.log('event emitted')
})

function openModal() {
  modal.open({
    title: 'Welcome'
  })
}
</script>
```

### open()

`open(props?: ComponentProps<T>): Promise<OpenedOverlay<T>>`{lang="ts-type"}

Open the overlay.

#### Parameters

::field-group
  ::field{name="props" type="ComponentProps<T>"}
  An optional object of props to pass to the rendered component.
  ::
::

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

### close()

`close(value?: any): void`{lang="ts-type"}

Close the overlay.

#### Parameters

::field-group
  ::field{name="value" type="any"}
  A value to resolve the overlay promise with.
  ::
::

### patch()

`patch(props: ComponentProps<T>): void`{lang="ts-type"}

Update the props of the overlay.

#### Parameters

::field-group
  ::field{name="props" type="ComponentProps<T>" required}
  An object of props to update on the rendered component.
  ::
::

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

modalA.on('close', (value) => {
  console.log(value)
})

const openModalA = () => {
  // Open modalA, but override the title prop
  modalA.open({ title: 'Hello' })
}

const openModalB = async () => {
  // Open modalB
  const modalBInstance = modalB.open()

  /// Open the slideover when modalB closes
  /// - Using the callback argument of the `on` method
  modalB.on('close', (input) => {
    slideoverA.open({ input })
  })

  /// - Using the promise returned by `open`
  // Wait for opening result (resolved automatically when the overlay is closed)
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

### Limitation for components with more than 5 emits

Because of TypeScript limitation for infer overloaded functions in conditional types (cf: https://github.com/microsoft/TypeScript/issues/32164).

Because of this limitation, you could expect typing issues for components with more than 5 defined emits. This limitation is set 5 as we use a trick to make work for most cases.