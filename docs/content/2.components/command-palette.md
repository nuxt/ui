---
title: CommandPalette
description: Add a customizable command palette to your app.
links:
  - label: 'Combobox'
    icon: i-simple-icons-headlessui
    to: 'https://headlessui.com/v1/vue/combobox'
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/navigation/CommandPalette.vue
---

## Usage

Use a `v-model` to display a searchable and selectable list of commands.

::component-example
---
padding: false
component: 'command-palette-example-basic'
componentProps:
  class: 'h-[257px]'
---
::

You can put a `CommandPalette` anywhere you want but it's most commonly used inside of a modal.

:component-example{component="command-palette-example-modal"}

You can pass multiple groups of commands to the component. Each group will be separated by a divider and will display a label.

Without a `v-model`, you can also listen on `@update:model-value` to navigate to a link or do something else when a command is clicked.

::component-example
---
padding: false
component: 'command-palette-example-groups'
componentProps:
  class: 'h-[274px]'
---
::

### Icon

Use any icon from [Iconify](https://icones.js.org) by setting the `icon` prop by using this pattern: `i-{collection_name}-{icon_name}`.

Use the `selected-icon` prop to set a different icon or change it globally in `ui.commandPalette.default.selectedIcon`. Defaults to `i-heroicons-check-20-solid`.

::component-card
---
padding: false
baseProps:
  emptyState: null
props:
  icon: 'i-heroicons-command-line'
excludedProps:
  - icon
---
::

### Loading

Use the `loading` prop to show a loading icon.

Use the `loading-icon` prop to set a different icon or change it globally in `ui.commandPalette.default.loadingIcon`. Defaults to `i-heroicons-arrow-path-20-solid`.

::component-card
---
padding: false
baseProps:
  emptyState: null
props:
  loading: true
excludedProps:
  - icon
---
::

### Placeholder

Use the `placeholder` prop to change the input placeholder

::component-card
---
padding: false
baseProps:
  emptyState: null
props:
  placeholder: 'Type a command...'
excludedProps:
  - icon
---
::

### Close

Use the `close-button` prop to display a close button on the right side of the input.

You can pass all the props of the [Button](/components/button) component to customize it through the `close-button` prop or globally through `ui.commandPalette.default.closeButton`.

::component-card
---
padding: false
baseProps:
  emptyState: null
props:
  closeButton:
    icon: 'i-heroicons-x-mark-20-solid'
    color: 'gray'
    variant: 'link'
    padded: false
excludedProps:
  - closeButton
---
::

### Empty

An empty state will be displayed when there are no results.

Use the `empty-state` prop to customize the `icon` and `label` or change them globally in `ui.commandPalette.default.emptyState`.

You can also set it to `null` to hide the empty state.

::component-card
---
padding: false
baseProps:
  placeholder: 'Type something to see the empty label change'
props:
  emptyState:
    icon: 'i-heroicons-magnifying-glass-20-solid'
    label: "We couldn't find any items."
    queryLabel: "We couldn't find any items with that term. Please try again."
excludedProps:
  - emptyState
---
::

## Full-text search

The CommandPalette component takes care of the full-text search for you with [Fuse.js](https://fusejs.io). You can pass all the options of Fuse.js through the `fuse` prop.

When searching for a command, the component will look for a `label` property on the command by default. You can customize this behavior by overriding the `command-attribute` prop. This will also affect the display of the command.

You can also highlight the matches in the command by setting the `fuse.fuseOptions.includeMatches` to `true`. The CommandPalette component automatically takes care of the highlighting for you.

```vue
<template>
  <UCommandPalette
    command-attribute="title"
    :fuse="{
      fuseOptions: {
        ignoreLocation: true,
        includeMatches: true,
        threshold: 0,
        keys: ['title', 'description', 'children.children.value', 'children.children.children.value']
      },
      resultLimit: 10
    }"
  />
</template>
```

::callout{icon="i-heroicons-light-bulb"}
Try it yourself in this documentation's search by pressing :shortcut{value="meta"} :shortcut{value="K" class="ml-1"}.
::

## Async search

You can also pass an `async` function to the `search` property of a group to perform an async search. The function will receive the query as its first argument and should return an array of commands.

::component-example
---
padding: false
component: 'command-palette-example-async'
componentProps:
  class: 'h-[274px]'
---
::

::callout{icon="i-heroicons-light-bulb"}
The `loading` state will automatically be enabled when a `search` function is loading. You can disable this behavior by setting the `loading-icon` prop to `null` or globally in `ui.commandPalette.default.loadingIcon`.
::

## Filter search

You can also pass a function to the `filter` property of a group to filter displayed commands after the search happened. The function will receive the query as its first argument, the array of commands as second argument and should return an array of commands.

::component-example
---
padding: false
component: 'command-palette-example-filter'
componentProps:
  class: 'h-[274px]'
---
::

## Slots

### `<group>-icon`

Use the `#<group>-icon` slot to override the left command content which display by default the `icon`, `avatar` and `chip`.

### `<group>-command`

Use the `#<group>-command` slot to override the command content which display by default the `prefix`, `suffix` and `label` (customizable through the `command-attribute` prop).

### `<group>-active`

Use the `#<group>-active` slot to override the right command content (when hovered) which display by default the `active` field of the group if provided.

### `<group>-inactive`

Use the `#<group>-inactive` slot to override the right command content (when not hovered) which display by default the `inactive` field of the group if provided or the `shortcuts` of the command.

::callout{icon="i-heroicons-light-bulb"}
The 4 slots above will have access to the `group`, `command`, `active` and `selected` properties in the slot scope.
::

### `empty-state`

Use the `#empty-state` slot to customize the empty state.

::component-example
---
padding: false
component: 'command-palette-example-empty-slot'
componentProps:
  class: 'flex-1'
---
::

## Props

:component-props

## API

When accessing the component via a template ref, you can use the following:

::field-group
  ::field{name="query" type="string"}
    The current query.
  ::
  ::field{name="updateQuery (query)"}
    Updates the current query.
  ::
  ::field{name="results" type="ComputedRef<FuseResult<Command>[]>"}
    The results exposed by [useFuse](https://vueuse.org/integrations/useFuse/#usefuse).
  ::
  ::field{name="comboboxApi"}
    The Combobox [API](https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-vue/src/components/combobox/combobox.ts#L384) exposed by Headless UI.
  ::
::

## Config

:component-preset

## Example

Here are a few examples illustrating how you can customize the appearance of the `CommandPalette` component by utilizing its `ui` prop.

### Algolia

::component-example
---
padding: false
component: 'command-palette-example-theme-algolia'
componentProps:
  class: 'max-h-[480px] rounded-md'
hiddenCode: true
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/dev/docs/components/content/examples/CommandPaletteExampleThemeAlgolia.vue#L23" target="_blank"}
Take a look at the component!
::

### Raycast

::component-example
---
padding: false
component: 'command-palette-example-theme-raycast'
componentProps:
  class: 'max-h-[480px] rounded-md'
hiddenCode: true
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/dev/docs/components/content/examples/CommandPaletteExampleThemeRaycast.vue#L30" target="_blank"}
Take a look at the component!
::
