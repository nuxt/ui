---
title: EditorSuggestionMenu
description: A command menu that displays formatting and action suggestions when typing the / character in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorSuggestionMenu.vue
navigation.badge: Soon
---

## Usage

The EditorSuggestionMenu component must be used inside an [Editor](/docs/components/editor) component's default slot to provide slash command functionality. It allows users to quickly insert blocks and formatting by typing a trigger character.

Type `/` in the editor to open the suggestion menu.

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-example'
class: 'p-8'
---
::

::note
The menu supports keyboard navigation (arrow keys, enter to select, escape to close) and filters items as you type.
::

### Items

Use the `items` prop to define the available commands in the menu. Items can be editor commands with a `kind` property or separators and labels.

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-items-example'
class: 'p-8'
---
::

Each item supports these properties:

| Property | Description |
| -------- | ----------- |
| `kind`{lang="ts-type"} | Editor command type (`heading`, `bulletList`, `blockquote`, etc.) |
| `label`{lang="ts-type"} | Display text for the item |
| `description`{lang="ts-type"} | Optional description shown below the label |
| `icon`{lang="ts-type"} | Icon displayed before the label |
| `type: 'label'`{lang="ts-type"} | Creates a section header (non-selectable) |
| `type: 'separator'`{lang="ts-type"} | Creates a visual divider between groups |

::tip
Use labels and separators to organize commands into logical groups for better discoverability.
::

### Trigger character

Use the `char` prop to change the trigger character. Defaults to `/`{lang="ts-type"}.

```vue
<template>
  <UEditorSuggestionMenu :editor="editor" :items="items" char=">" />
</template>
```

::tip
Common alternatives include `>` for block commands or `+` for insertions.
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

```vue
<template>
  <UEditorSuggestionMenu
    :editor="editor"
    :items="items"
    :options="{
      placement: 'bottom-start',
      offset: 4
    }"
  />
</template>
```

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### With sections

Create an organized suggestion menu with labeled sections and separators.

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-custom-example'
class: 'p-8'
---
::

### With descriptions

Add descriptions to help users understand what each command does.

::component-example
---
elevated: true
collapse: true
name: 'editor-suggestion-menu-icons-example'
class: 'p-8'
---
::

::tip
Descriptions are especially useful for less common formatting options or custom commands.
::

## API

### Props

:component-props

## Theme

:component-theme

## Changelog

:component-changelog
