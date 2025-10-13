---
title: AvatarGroup
description: Stack multiple avatars in a group.
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/AvatarGroup.vue
---

## Usage

Wrap multiple [Avatar](/docs/components/avatar) within an AvatarGroup to stack them.

::component-code
---
prettier: true
slots:
  default: |

    <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
    <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
---
:u-avatar{src="https://github.com/benjamincanac.png" alt="Benjamin Canac"}
:u-avatar{src="https://github.com/romhml.png" alt="Romain Hamel"}
:u-avatar{src="https://github.com/noook.png" alt="Neil Richter"}
::

### Size

Use the `size` prop to change the size of all the avatars.

::component-code
---
prettier: true
props:
  size: xl
slots:
  default: |

    <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
    <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
---
:u-avatar{src="https://github.com/benjamincanac.png" alt="Benjamin Canac"}
:u-avatar{src="https://github.com/romhml.png" alt="Romain Hamel"}
:u-avatar{src="https://github.com/noook.png" alt="Neil Richter"}
::

### Max

Use the `max` prop to limit the number of avatars displayed. The rest is displayed as an `+X` avatar.

::component-code
---
prettier: true
props:
  max: 2
slots:
  default: |

    <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
    <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
---
:u-avatar{src="https://github.com/benjamincanac.png" alt="Benjamin Canac"}
:u-avatar{src="https://github.com/romhml.png" alt="Romain Hamel"}
:u-avatar{src="https://github.com/noook.png" alt="Neil Richter"}
::

## Examples

### With tooltip

Wrap each avatar with a [Tooltip](/docs/components/tooltip) to display a tooltip on hover.

:component-example{name="avatar-group-tooltip-example"}

### With chip

Wrap each avatar with a [Chip](/docs/components/chip) to display a chip around the avatar.

:component-example{name="avatar-group-chip-example"}

### With link

Wrap each avatar with a [Link](/docs/components/link) to make them clickable.

:component-example{name="avatar-group-link-example"}

### With mask

Wrap an avatar with a CSS mask to display it with a custom shape.

:component-example{name="avatar-group-mask-example"}

::warning
The `chip` prop does not work correctly when using a mask. Chips may be cut depending on the mask shape.
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
