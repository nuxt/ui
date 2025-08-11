---
title: ChatMessage
description: 'Display a chat message with icon, avatar, and actions.'
category: ai
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatMessage.vue
---

## Usage

The ChatMessage component renders an `<article>` element for a `user` or `assistant` chat message.

::code-preview

::u-chat-message
---
content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
side: 'right'
variant: 'soft'
avatar:
  src: 'https://github.com/benjamincanac.png'
---
::

::

::tip{to="/docs/components/chat-messages"}
Use the [`ChatMessages`](/docs/components/chat-messages) component to display a list of chat messages.
::

### Content

Use the `content` prop to display the message content.

::component-code
---
prettier: true
props:
  content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
---
::

### Side

Use the `side` prop to display the message on the left or right.

::component-code
---
prettier: true
ignore:
  - content
props:
  side: 'right'
  content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
---
::

::note
When using the [`ChatMessages`](/docs/components/chat-messages) component, the `side` prop is set to `left` for `assistant` messages and `right` for `user` messages.
::

### Variant

Use the `variant` prop to change style of the message.

::component-code
---
prettier: true
ignore:
  - content
props:
  variant: 'soft'
  content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
---
::

::note
When using the [`ChatMessages`](/docs/components/chat-messages) component, the `variant` prop is set to `naked` for `assistant` messages and `soft` for `user` messages.
::

### Icon

Use the `icon` prop to display an [Icon](/docs/components/icon) component next to the message.

::component-code
---
prettier: true
ignore:
  - content
  - side
  - variant
props:
  icon: i-lucide-user
  variant: 'soft'
  side: 'right'
  content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
---
::

### Avatar

Use the `avatar` prop to display an [Avatar](/docs/components/avatar) component next to the message.

::component-code
---
prettier: true
ignore:
  - content
  - side
  - variant
props:
  avatar:
    src: 'https://github.com/benjamincanac.png'
  variant: 'soft'
  side: 'right'
  content: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
---
::

You can also use the `avatar.icon` prop to display an icon as the avatar.

::component-code
---
prettier: true
ignore:
  - content
props:
  avatar:
    icon: i-lucide-bot
  content: 'Nuxt UI offers several features for building AI chatbots including the ChatMessage, ChatMessages, and ChatPrompt components. Best practices include using the useChat composable from Vercel AI SDK, implementing proper message styling with variants, and utilizing the built-in actions for message interactions. The components are fully customizable with theming support and responsive design.'
---
::

### Actions

Use the `actions` prop to display actions below the message that will be displayed when hovering over the message.

::component-code
---
prettier: true
external:
  - actions
ignore:
  - content
  - actions
props:
  actions:
    - label: 'Copy to clipboard'
      icon: i-lucide-copy
  content: 'Nuxt UI offers several features for building AI chatbots including the ChatMessage, ChatMessages, and ChatPrompt components. Best practices include using the useChat composable from Vercel AI SDK, implementing proper message styling with variants, and utilizing the built-in actions for message interactions. The components are fully customizable with theming support and responsive design.'
---
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
