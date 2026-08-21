---
title: defineShortcuts
description: 'A composable to define keyboard shortcuts in your app.'
---

## Usage

Use the auto-imported `defineShortcuts` composable to define keyboard shortcuts.

```vue
<script setup lang="ts">
const open = ref(false)

defineShortcuts({
  meta_k: () => {
    open.value = !open.value
  }
})
</script>
```

- Shortcuts are automatically adjusted for non-macOS platforms, converting `meta` to `ctrl`.
- The composable uses VueUse's [`useEventListener`](https://vueuse.org/core/useEventListener/) to handle keydown events.
- For a complete list of available shortcut keys, refer to the [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) API documentation. Keys in the config are case-insensitive, so `meta_k` and `meta_K` are equivalent.

::tip{to="/docs/components/kbd"}
Learn how to display shortcuts in components in the **Kbd** component documentation.
::

## API

`defineShortcuts(config: MaybeRef<ShortcutsConfig>, options?: ShortcutsOptions): () => void`{lang="ts-type"}

Define keyboard shortcuts for your application. Returns a function that removes the listener, in case you need to stop the shortcuts before the component unmounts.

### Parameters

::field-group

  ::field{name="config" type="MaybeRef<ShortcutsConfig>" required}
  An object where keys are shortcut definitions and values are either handler functions or shortcut configuration objects. Pass a `ref` to update the shortcuts reactively. A value of `false`, `null` or `undefined` skips that shortcut, which is how you enable one conditionally.
  ::

  ::field{name="options" type="ShortcutsOptions"}
  Optional configuration for the shortcuts behavior.

    ::collapsible

      ::field-group
        ::field{name="chainDelay" type="number"}
        The delay between key presses to consider the shortcut as chained. Defaults to `800`.
        ::

        ::field{name="layoutIndependent" type="boolean"}
        When enabled, shortcuts work consistently across different keyboard layouts (Arabic, Hebrew) by matching physical key positions rather than character values.
        - `false` (default): Uses `e.key` for character-based matching (Layout specific)
        - `true`: Uses `e.code` for physical key matching (Layout agnostic)
        ::
      ::
    ::
  ::
::

### Shortcut definition

Shortcuts are defined using the following format:

- Single key: `'a'`, `'b'`, `'1'`, `'?'`, etc.
- Key combinations: Use `_` to separate keys, e.g. `'meta_k'`, `'ctrl_shift_f'`
- Key sequences: Use `-` to define a sequence, e.g. `'g-d'`

### Modifiers

- `meta` / `command`: Represents `⌘ Command` on macOS and `Ctrl` on other platforms
- `ctrl`: Represents `Ctrl` on all platforms
- `shift`: Used for alphabetic keys when Shift is required
- `alt` / `option`: Represents `⌥ Option` on macOS and `Alt` on other platforms. Matched by physical key position, since Option rewrites the character on macOS

### Special keys

Use these names to match keys that don't produce a character.

- `escape`: Triggers on Esc key
- `enter`: Triggers on Enter key
- `arrowleft`, `arrowright`, `arrowup`, `arrowdown`: Trigger on respective arrow keys
- `tab`: Triggers on Tab key
- `backspace`: Triggers on Backspace key
- `delete`: Triggers on Delete key
- `space`: Triggers on the space bar. Requires `layoutIndependent` unless combined with `alt`

### Shortcut configuration

Each shortcut can be defined as a function or an object with the following properties:

`interface ShortcutConfig { handler: (e?: KeyboardEvent) => void; usingInput?: boolean | string }`{lang="ts-type"}

#### Parameters

::field-group
  ::field{name="handler" type="(e?: KeyboardEvent) => void" required}
  Function to be executed when the shortcut is triggered. It receives the originating `KeyboardEvent`.
  ::

  ::field{name="usingInput" type="boolean | string"}
  Controls when the shortcut should trigger based on input focus:
  - `false` (default): Shortcut only triggers when no input is focused
  - `true`: Shortcut triggers even when any input is focused
  - `string`: Shortcut only triggers when the specified input (by name) is focused
  ::
::

## Examples

### Basic usage

```vue
<script setup lang="ts">
defineShortcuts({
  '?': () => openHelpModal(),
  'meta_k': () => openCommandPalette(),
  'g-d': () => navigateToDashboard()
})
</script>
```

### With input focus handling

Use `usingInput` to trigger a shortcut only when a specific input is focused.

```vue
<template>
  <UInput v-model="query" name="queryInput" />
</template>

<script setup lang="ts">
const query = ref('')

defineShortcuts({
  enter: {
    usingInput: 'queryInput',
    handler: () => performSearch()
  },
  escape: {
    usingInput: true,
    handler: () => clearSearch()
  }
})
</script>
```

### Extracting shortcuts from menu items

Use the `extractShortcuts` utility to automatically define shortcuts from menu items.

::tip{to="/docs/composables/extract-shortcuts"}
Learn more about the **extractShortcuts** utility.
::
