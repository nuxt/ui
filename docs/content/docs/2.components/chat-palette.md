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

::tip{to="/docs/components/chat-messages#examples"}
Check the **ChatMessages** documentation for server API setup and installation instructions.
::

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
You can enhance your chatbot with tool calling capabilities using the [Model Context Protocol](https://ai-sdk.dev/docs/ai-sdk-core/mcp-tools) (`@ai-sdk/mcp`). This allows the AI to search your documentation or perform other actions:

::code-collapse

```ts [server/api/search.ts]
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { experimental_createMCPClient } from '@ai-sdk/mcp'
import { gateway } from '@ai-sdk/gateway'

export default defineEventHandler(async (event) => {
  const { messages } = await readBody(event)

  const httpTransport = new StreamableHTTPClientTransport(
    new URL('https://your-app.com/mcp')
  )
  const httpClient = await experimental_createMCPClient({
    transport: httpTransport
  })
  const tools = await httpClient.tools()

  return streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    maxOutputTokens: 10000,
    system: 'You are a helpful assistant. Use your tools to search for relevant information before answering questions.',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
    tools,
    onFinish: async () => {
      await httpClient.close()
    },
    onError: async (error) => {
      console.error(error)
      await httpClient.close()
    }
  }).toUIMessageStreamResponse()
})
```

::

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
