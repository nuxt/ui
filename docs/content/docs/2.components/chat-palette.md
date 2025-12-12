---
title: ChatPalette
description: 'A chat palette to create a chatbot interface inside an overlay.'
category: chat
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatPalette.vue
---

## Usage

The ChatPalette component is a structured layout wrapper that organizes [ChatMessages](/docs/components/chat-messages) in a scrollable content area and [ChatPrompt](/docs/components/chat-prompt) in a fixed bottom section, creating cohesive chatbot interfaces for modals, slideovers, or drawers.

```vue{2,8}
<template>
  <UChatPalette>
    <UChatMessages />

    <template #prompt>
      <UChatPrompt />
    </template>
  </UChatPalette>
</template>
```

## Examples

::note
These chat components are designed to be used with the [Vercel AI SDK](https://ai-sdk.vercel.dev/), specifically the [`Chat`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/chat) class for managing chat state and streaming responses.
::

You can get started with a simple server API endpoint to handle chat requests using [`streamText`](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text#streamtext) from the AI SDK. You can use the [Vercel AI Gateway](https://vercel.com/ai-gateway) to access AI models through a centralized endpoint:

```ts [server/api/chat.post.ts]
import { streamText, convertToModelMessages } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  return streamText({
    model: gateway('openai/gpt-4o-mini'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages)
  }).toUIMessageStreamResponse()
})
```

### Within a Modal

You can use the ChatPalette component inside a [Modal](/docs/components/modal)'s content.

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'chat-palette-modal-example'
---
::

### Within ContentSearch

You can use the ChatPalette component conditionally inside [ContentSearch](/docs/components/content-search)'s content to display a chatbot interface when a user selects an item.

::component-example
---
collapse: true
iframe:
  height: 500px;
iframeMobile: true
overflowHidden: true
name: 'chat-palette-content-search-example'
---
::

::tip
You can press :kbd{value="meta"} :kbd{value="K"} to open the search on this documentation to try a real-life example.
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
