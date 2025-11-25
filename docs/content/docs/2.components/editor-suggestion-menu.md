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

The EditorSuggestionMenu component must be used inside an [Editor](/docs/components/editor) component's default slot to provide slash command functionality.

Type `/` to open the suggestion menu and browse available formatting commands and actions.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-example'
class: 'min-h-80'
---
::

::note
The suggestion menu filters items as you type and supports keyboard navigation with arrow keys and enter to select.
::

### Items

Use the `items` prop to define the available commands in the menu. Items can be editor commands with a `kind` property or separators and labels.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-items-example'
class: 'min-h-80'
---
::

Each item can have:
- `kind`{lang="ts-type"}: The editor command type (e.g., `heading`, `bulletList`, etc.)
- `label`{lang="ts-type"}: Display text for the item
- `description`{lang="ts-type"}: Optional description text
- `icon`{lang="ts-type"}: Icon to display
- `type: 'label'`{lang="ts-type"}: For section headers
- `type: 'separator'`{lang="ts-type"}: For visual separators

::tip
Group related commands with labels to create organized, scannable menus.
::

### Trigger character

Use the `char` prop to change the trigger character. Defaults to `/`.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-char-example'
class: 'min-h-80'
---
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-options-example'
class: 'min-h-80'
---
::

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### With custom items

Create a fully customized suggestion menu with your own commands and groupings.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-custom-example'
class: 'min-h-80'
---
::

### With icons and descriptions

Add icons and descriptions to make commands more discoverable.

::component-example
---
collapse: true
name: 'editor-suggestion-menu-icons-example'
class: 'min-h-80'
---
::

::tip
Descriptions help users understand what each command does, especially for less common formatting options.
::

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
