---
title: EditorMentionMenu
description: A mention menu that displays user suggestions when typing the @ character in the editor.
category: editor
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/EditorMentionMenu.vue
navigation.badge: Soon
---

## Usage

The EditorMentionMenu component must be used inside an [Editor](/docs/components/editor) component's default slot to provide @ mention functionality.

Type `@` followed by a name to search and insert mentions into your content.

::component-example
---
collapse: true
name: 'editor-mention-menu-example'
class: 'min-h-80'
---
::

::note
The mention menu automatically filters items as you type and supports keyboard navigation.
::

### Items

Use the `items` prop to define the available mentions. Each item can include a label, avatar, icon, and description.

::component-example
---
collapse: true
name: 'editor-mention-menu-items-example'
class: 'min-h-80'
---
::

Each item should have:
- `label`{lang="ts-type"}: The mention text (required)
- `avatar`{lang="ts-type"}: Avatar props for displaying a user image
- `icon`{lang="ts-type"}: Icon to display if no avatar is provided
- `description`{lang="ts-type"}: Optional description text
- `disabled`{lang="ts-type"}: Whether the item can be selected

::tip
Use avatars for user mentions and icons for other entities like teams or channels.
::

### Trigger character

Use the `char` prop to change the trigger character. Defaults to `@`.

::component-example
---
collapse: true
name: 'editor-mention-menu-char-example'
class: 'min-h-80'
---
::

### Options

Use the `options` prop to customize the positioning behavior using Floating UI options.

::component-example
---
collapse: true
name: 'editor-mention-menu-options-example'
class: 'min-h-80'
---
::

::tip{to="https://floating-ui.com/docs/computeposition" target="_blank"}
The options are passed to Floating UI's `computePosition` function. You can configure strategy, placement, offset, flip, shift, and other positioning middleware.
::

## Examples

### User mentions

Create a mention menu for tagging users in your content.

::component-example
---
collapse: true
name: 'editor-mention-menu-users-example'
class: 'min-h-80'
---
::

### With fetched data

Fetch mention suggestions from an API as users type.

::component-example
---
collapse: true
name: 'editor-mention-menu-fetched-example'
class: 'min-h-80'
---
::

::note
This example demonstrates how to dynamically load mentions based on user input.
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
