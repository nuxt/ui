---
title: ChatShimmer
description: Display a text shimmer animation effect.
category: chat
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatShimmer.vue
navigation.badge: Soon
---

## Usage

The ChatShimmer component renders an element with an animated shimmer gradient over text, commonly used to indicate streaming or loading states in chat interfaces.

::component-code
---
props:
  label: 'Thinking...'
---
::

### Duration

Use the `duration` prop to control the animation speed in seconds.

::component-code
---
props:
  label: 'Thinking...'
  duration: 4
---
::

### Spread

Use the `spread` prop to control the width of the shimmer highlight. The actual spread is computed as `label.length * spread` in pixels.

::component-code
---
props:
  label: 'Thinking...'
  spread: 5
---
::

## API

### Props

:component-props

## Theme

:component-theme

## Changelog

:component-changelog
