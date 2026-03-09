---
title: Repeater
description: A dynamic list component with drag & drop sorting, custom limits, and extensive slot support.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Repeater.vue
navigation.badge: New
---

## Usage

The Repeater component allows users to manage a dynamic list of items. It supports drag-and-drop reordering, manual sorting buttons, and item limitations. It is fully typed and supports complex objects via `newItemTemplate`.

You can use the `v-model` directive to bind the array of items.

```vue
<script setup lang="ts">
const items = ref(["Item 1", "Item 2"]);
</script>

<template>
  <URepeater v-model="items">
    <template #default="{ item, index }">
      <UInput v-model="items[index]" />
    </template>
  </URepeater>
</template>
```

### Objects & Template

When working with arrays of objects, use the `new-item-template` prop to define the structure of new items added to the list.

```vue
<script setup lang="ts">
const users = ref([{ id: 1, name: "John Doe" }]);

const userTemplate = () => ({
  id: Date.now(), // Unique ID
  name: "",
});
</script>

<template>
  <URepeater
    v-model="users"
    :new-item-template="userTemplate"
    add-button-label="Add User"
  >
    <template #default="{ item }">
      <UInput v-model="item.name" placeholder="User Name" />
    </template>
  </URepeater>
</template>
```

### Drag & Drop Styling

The Repeater uses `useSortable` under the hood. You can customize the visual feedback during drag operations using `ghost-class`, `fallback-class`, and `drag-class` props.

::warning
**Important:** The values for `ghost-class`, `fallback-class`, and `drag-class` must be a **single class name**. Do not pass multiple space-separated classes (e.g., `'bg-red-500 opacity-50'`), as this will cause `DOMTokenList` errors in the browser.
::

```vue
<template>
  <URepeater
    v-model="items"
    ghost-class="my-custom-ghost"
    drag-class="my-custom-drag"
  />
</template>

<style scoped>
.my-custom-ghost {
  @apply opacity-50 border-2 border-dashed border-primary-500 bg-primary-50;
}
.my-custom-drag {
  @apply cursor-grabbing shadow-2xl;
}
</style>
```

### Limits

Control the number of items using `max-items` and `min-items`. The "Add" and "Remove" buttons will automatically disable when these limits are reached.

```vue
<template>
  <URepeater v-model="items" :min-items="1" :max-items="5" />
</template>
```

### Customizing Actions

You can customize the action buttons in two ways: simple customization via props or full control via slots.

#### Using Props

You can easily change the icons and labels using props like `add-button-label`, `add-icon`, `remove-icon`, `sort-up-icon`, and `sort-down-icon`.

#### Using Slots

For complete control, use the `#add-button` and `#actions` slots. This allows you to replace the default buttons with your own components or logic.

The `#actions` slot exposes `moveUp`, `moveDown`, and `remove` methods, while the `#add-button` slot exposes the `add` method.

```vue
<template>
  <URepeater v-model="items">
    <template #add-button="{ add, disabled }">
      <UButton
        label="Add New Entry"
        icon="i-heroicons-plus-circle"
        color="primary"
        block
        :disabled="disabled"
        @click="add"
      />
    </template>

    <template #actions="{ remove, moveUp, moveDown, index }">
      <div class="flex gap-1">
        <UButton
          icon="i-heroicons-arrow-up"
          size="xs"
          variant="soft"
          @click="moveUp"
        />
        <UButton
          icon="i-heroicons-arrow-down"
          size="xs"
          variant="soft"
          @click="moveDown"
        />
        <UButton
          icon="i-heroicons-trash"
          size="xs"
          color="red"
          variant="solid"
          @click="remove"
        />
      </div>
    </template>
  </URepeater>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following methods:

| Name     | Type                                          | Description                             |
| -------- | --------------------------------------------- | --------------------------------------- |
| `add`    | `() => void`                                  | Adds a new item using the template.     |
| `remove` | `(index: number) => void`                     | Removes an item at the specified index. |
| `move`   | `(index: number, direction: -1 \| 1) => void` | Moves an item up or down.               |

```vue
<script setup lang="ts">
const repeaterRef = ref();

function manualAdd() {
  repeaterRef.value?.add();
}
</script>

<template>
  <URepeater ref="repeaterRef" v-model="items" />
</template>
```

## Theme

:component-theme

## Changelog

:component-changelog
