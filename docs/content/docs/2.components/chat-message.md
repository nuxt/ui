---
title: ChatMessage
description: 'Display a chat message with icon, avatar, and actions.'
category: chat
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
parts:
  - type: 'text'
    id: '1'
    text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
side: 'right'
variant: 'soft'
role: 'user'
id: '1'
avatar:
  src: 'https://github.com/benjamincanac.png'
---
::

::

::tip{to="/docs/components/chat-messages"}
Use the `ChatMessages` component to display a list of chat messages.
::

### Parts

Use the `parts` prop to display the message content using the AI SDK v5 format.

::component-code
---
prettier: true
ignore:
  - parts
  - role
  - id
props:
  parts:
    - type: 'text'
      id: '1'
      text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
  role: 'user'
  id: '1'
---
::

::note
The `parts` prop is the recommended format for AI SDK v5. Each part has a `type` (e.g., 'text') and corresponding content. The ChatMessage component also supports the deprecated `content` prop for backward compatibility.
::

### Side

Use the `side` prop to display the message on the left or right.

::component-code
---
prettier: true
ignore:
  - parts
  - role
  - id
props:
  side: 'right'
  parts:
    - type: 'text'
      id: '1'
      text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
  role: 'user'
  id: '1'
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
  - parts
  - role
  - id
props:
  variant: 'soft'
  parts:
    - type: 'text'
      id: '1'
      text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
  role: 'user'
  id: '1'
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
  - parts
  - side
  - variant
  - role
  - id
props:
  icon: i-lucide-user
  variant: 'soft'
  side: 'right'
  parts:
    - type: 'text'
      id: '1'
      text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
  role: 'user'
  id: '1'
---
::

### Avatar

Use the `avatar` prop to display an [Avatar](/docs/components/avatar) component next to the message.

::component-code
---
prettier: true
ignore:
  - parts
  - side
  - variant
  - role
  - id
props:
  avatar:
    src: 'https://github.com/benjamincanac.png'
  variant: 'soft'
  side: 'right'
  parts:
    - type: 'text'
      id: '1'
      text: 'Hello! Tell me more about building AI chatbots with Nuxt UI.'
  role: 'user'
  id: '1'
---
::

You can also use the `avatar.icon` prop to display an icon as the avatar.

::component-code
---
prettier: true
ignore:
  - parts
  - role
  - id
props:
  avatar:
    icon: i-lucide-bot
  parts:
    - type: 'text'
      id: '1'
      text: 'Nuxt UI offers several features for building AI chatbots including the ChatMessage, ChatMessages, and ChatPrompt components. Best practices include using the Chat class from AI SDK v5, implementing proper message styling with variants, and utilizing the built-in actions for message interactions. The components are fully customizable with theming support and responsive design.'
  role: 'assistant'
  id: '1'
---
::

### Actions

Use the `actions` prop to display actions below the message that will be displayed when hovering over the message.

::component-code
---
prettier: true
external:
  - actions
externalTypes:
  - ButtonProps[]
ignore:
  - parts
  - actions
  - role
  - id
props:
  actions:
    - label: 'Copy to clipboard'
      icon: i-lucide-copy
  parts:
    - type: 'text'
      id: '1'
      text: 'Nuxt UI offers several features for building AI chatbots including the ChatMessage, ChatMessages, and ChatPrompt components. Best practices include using the Chat class from AI SDK v5, implementing proper message styling with variants, and utilizing the built-in actions for message interactions. The components are fully customizable with theming support and responsive design.'
  role: 'user'
  id: '1'
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
