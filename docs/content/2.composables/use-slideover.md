---
title: useSlideover
description: 'A composable to programmatically control a Slideover component.'
---

## Usage

Use the auto-imported `useSlideover` composable to programmatically control a [Slideover](/components/slideover) component.

```vue
<script setup lang="ts">
const slideover = useSlideover()
</script>
```

- The `useSlideover` composable is created using `createSharedComposable`, ensuring that the same slideover state is shared across your entire application.

::tip{to="/components/slideover"}
Learn how to customize the appearance and behavior of slideovers in the **Slideover** component documentation.
::

## API

### `open(component: Component, props?: SlideoverProps & ComponentProps<T>)`

Opens a slideover with the specified component and props.

- Parameters:
  - `component`: The Vue component to render inside the slideover.
  - `props`: An optional object of props to pass to both the Slideover and the rendered component.

````vue
<script setup lang="ts">
const slideover = useSlideover()

function openSlideover() {
  slideover.open(MySlideoverContent, { title: 'Welcome' })
}
</script>
````

### `close(): Promise<void>`

Closes the currently open slideover.

````vue
<script setup lang="ts">
const slideover = useSlideover()

async function closeSlideover() {
  await slideover.close()
}
</script>
````

### `reset()`

Resets the slideover state to its default values.

````vue
<script setup lang="ts">
const slideover = useSlideover()

function resetSlideover() {
  slideover.reset()
}
</script>
````

### `patch(props: Partial<SlideoverProps & ComponentProps<T>>)`

Updates the props of the currently open slideover.

````vue
<script setup lang="ts">
const slideover = useSlideover()

function updateSlideoverTitle() {
  slideover.patch({ title: 'Updated Title' })
}
</script>
````

## Example

Here's a complete example of how to use the `useSlideover` composable:

````vue
<template>
  <div>
    <button @click="openSlideover">Open Slideover</button>
    <button @click="closeSlideover">Close Slideover</button>
    <button @click="updateSlideoverTitle">Update Title</button>
  </div>
</template>

<script setup lang="ts">
const slideover = useSlideover()

const openSlideover = () => {
  slideover.open(MySlideoverContent, { title: 'Welcome' })
}

const closeSlideover = async () => {
  await slideover.close()
}

const updateSlideoverTitle = () => {
  slideover.patch({ title: 'Updated Welcome' })
}
</script>
````

In this example, we're using the `useSlideover` composable to control a slideover. We can open it with a specific component and props, close it, and update its props.
