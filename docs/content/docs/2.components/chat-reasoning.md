---
title: ChatReasoning
description: Display a collapsible AI reasoning or thinking process.
category: chat
links:
  - label: Collapsible
    icon: i-custom-reka-ui
    to: https://reka-ui.com/docs/components/collapsible
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatReasoning.vue
navigation.badge: New
---

## Usage

The ChatReasoning component renders a collapsible block that displays AI reasoning or thinking content. It auto-opens during streaming and auto-closes after.

::component-example
---
collapse: true
prettier: true
name: 'chat-reasoning-example'
class: 'h-[252px]'
---
::

::note{to="/docs/composables/use-scroll-shadow"}
The body content uses the `useScrollShadow` composable to apply fade shadows when overflowing.
::

### Text

Use the `text` prop to set the reasoning content. The text is displayed inside the collapsible body.

::component-code
---
prettier: true
hide:
  - class
props:
  text: 'The user is asking about Vue components...'
  class: 'w-60'
---
::

### Streaming

Use the `streaming` prop to indicate active reasoning. The component auto-opens when streaming starts and auto-closes when it ends.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  streaming: true
  text: 'The user is asking about Vue components...'
  class: 'w-60'
---
::

::tip
Use the `isReasoningStreaming` utility from `@nuxt/ui/utils/ai` to determine if a reasoning part is currently being streamed.
::

### Shimmer

When streaming, the trigger label uses the [`ChatShimmer`](/docs/components/chat-shimmer) component. Use the `shimmer` prop to customize its `duration` and `spread`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  streaming: true
  text: 'The user is asking about Vue components...'
  shimmer:
    duration: 2
    spread: 2
  class: 'w-60'
---
::

### Icon

Use the `icon` prop to display an [Icon](/docs/components/icon) component next to the trigger.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  icon: i-lucide-brain
  text: 'The user is asking about Vue components...'
  class: 'w-60'
---
::

### Chevron

Use the `chevron` prop to change the position of the chevron icon.

::note
When `chevron` is set to `leading` with an `icon`, the icon swaps with the chevron on hover and when open.
::

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  chevron: leading
  icon: i-lucide-brain
  text: 'The user is asking about Vue components...'
  class: 'w-60'
---
::

### Chevron Icon

Use the `chevron-icon` prop to customize the chevron [Icon](/docs/components/icon). Defaults to `i-lucide-chevron-down`.

::component-code
---
prettier: true
hide:
  - class
ignore:
  - text
props:
  chevronIcon: 'i-lucide-arrow-down'
  text: 'The user is asking about Vue components...'
  class: 'w-60'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.chevronDown` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.chevronDown` key.
:::
::

## Examples

::tip{to="/docs/components/chat"}
Check the **Chat** overview page for installation instructions, server setup and usage examples.
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
