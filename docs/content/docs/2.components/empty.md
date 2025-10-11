---
title: Empty
description: 'A component used to display a placeholder when no data is available.'
category: data
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Empty.vue
navigation.badge: New
---

## Usage

::component-preview
:::u-empty
---
icon: i-lucide-file
title: No projects found
description: Get started by creating a new project.
actions:
  - icon: i-lucide-plus
    label: New Project
  - icon: i-lucide-refresh-cw
    label: Refresh
    color: neutral
    variant: subtle
---
:::
::

### Title

Use the `title` prop to set the title of the empty state.

::component-code
---
props:
  title: No projects found
---
::

### Description

Use the `description` prop to set the description of the empty state.

::component-code
---
prettier: true
ignore:
  - title
props:
  title: No projects found
  description: Get started by creating a new project.
---
::

### Icon

Use the `icon` prop to set the icon of the empty state.

::component-code
---
prettier: true
ignore:
  - title
  - description
props:
  icon: i-lucide-file
  title: No projects found
  description: Get started by creating a new project.
---
::

### Content

Use the `default` slot to add content to the empty state.

::component-code
---
prettier: true
ignore:
  - icon
  - title
  - description
  - actions
props:
  title: No projects found
  description: Get started by creating a new project.
  actions:
    - icon: i-lucide-plus
      label: New Project
slots:
  default: |

    <Placeholder class="w-52 h-32" />
---
:placeholder{.w-52.h-32}
::

### Actions

Use the `actions` prop to add some [Button](/docs/components/button) actions to the empty state.

::component-code
---
prettier: true
ignore:
  - icon
  - title
  - description
  - actions
props:
  icon: i-lucide-file
  title: No projects found
  description: Get started by creating a new project.
  actions:
    - icon: i-lucide-plus
      label: New Project
---
::

### Variant

Use the `variant` prop to change the variant of the empty state.

::component-code
---
prettier: true
ignore:
  - icon
  - title
  - description
  - actions
props:
  variant: ghost
  icon: i-lucide-bell
  title: No notifications
  description: You're all caught up. New notifications will appear here.
  actions:
    - icon: i-lucide-refresh-cw
      label: Refresh
      variant: subtle
      color: neutral
---
::

## Examples

::component-example
---
collapse: true
name: 'empty-example'
class: '!p-0'
props:
  autofocus: false
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
