---
title: AvatarGroup
description: Stack multiple avatars in a group.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/AvatarGroup.vue
---

## Usage

Wrap multiple [Avatar](/components/avatar) within an AvatarGroup to stack them.

::component-code
---
slots:
  default: |
    <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
    <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
    <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
---
:u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac"}
:u-avatar{src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml"}
:u-avatar{src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook"}
::

### Size

Use the `size` prop to change the size of all the avatars.

::component-code
---
props:
  size: md
slots:
  default: |
    <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
    <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
    <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
---
:u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac"}
:u-avatar{src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml"}
:u-avatar{src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook"}
::

### Max

Use the `max` prop to limit the number of avatars displayed. The rest will be displayed as a `+X` avatar.

::component-code
---
props:
  max: 2
slots:
  default: >
    <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
    <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
    <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
---
:u-avatar{src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac"}
:u-avatar{src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml"}
:u-avatar{src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook"}
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
