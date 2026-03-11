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
navigation.badge: Soon
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
  text: 'Let me think about this...'
  class: 'w-60'
---
::

::tip{to="#within-a-page"}
Use the `isStreamingPart` utility from `@nuxt/ui/utils/ai` to determine if a specific message part is currently being streamed.
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
  text: 'Let me think about this...'
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

::tip{to="/docs/components/chat-messages#examples"}
Check the **ChatMessages** documentation for server API setup and installation instructions.
::

### Within a page

Use the ChatReasoning component inside the [`ChatMessages`](/docs/components/chat-messages) `#content` slot to display reasoning blocks alongside regular message parts.

The AI SDK provides the [`isReasoningUIPart`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/is-reasoning-ui-part) helper to identify reasoning parts in a message.

```vue [pages/\[id\\].vue] {2,4,34-44}
<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isStreamingPart } from '@nuxt/ui/utils/ai'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  chat.sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
        >
          <template #content="{ message }">
            <template
              v-for="(part, index) in message.parts"
              :key="`${message.id}-${part.type}-${index}`"
            >
              <UChatReasoning
                v-if="isReasoningUIPart(part)"
                :text="part.text"
                :streaming="isStreamingPart(message, index, chat)"
              >
                <MDC
                  :value="part.text"
                  :cache-key="`reasoning-${message.id}-${index}`"
                  class="*:first:mt-0 *:last:mb-0"
                />
              </UChatReasoning>

              <MDC
                v-else-if="isTextUIPart(part)"
                :value="part.text"
                :cache-key="`${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
            </template>
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer class="pb-4 sm:pb-6">
        <UChatPrompt
          v-model="input"
          :error="chat.error"
          @submit="onSubmit"
        >
          <UChatPromptSubmit
            :status="chat.status"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-templates/chat" target="_blank"}
Check out the source code of our **AI Chat template** on GitHub for a real-life example.
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
