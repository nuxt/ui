---
title: ChatAttachment
description: Display a file attached to a prompt or a chat message.
category: chat
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatAttachment.vue
navigation.badge: Soon
---

## Usage

The ChatAttachment component displays a file as a thumbnail when it is an image, or as its name with an icon otherwise.

::note
This component is automatically used by the [`ChatPrompt`](/docs/components/chat-prompt#files) component to list the files bound with `v-model:files`.
::

### File

Use the `file` prop to display a `File`, such as one picked by the user. Its name and type are read from it and images are previewed through an object URL.

```vue
<script setup lang="ts">
defineProps<{
  file: File
}>()
</script>

<template>
  <UChatAttachment :file="file" />
</template>
```

### Name

Use the `name` and `type` props to display a file you only have the details of, like a file part of a message.

::component-code
---
props:
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Url

Use the `url` prop to preview an image. The image is displayed when `type` is an image media type.

::component-code
---
props:
  name: 'landscape.jpg'
  type: 'image/jpeg'
  url: 'https://picsum.photos/id/1015/200'
---
::

::tip
Map a file part of a message to these props in the `#files` slot of [ChatMessage](/docs/components/chat-message) or [ChatMessages](/docs/components/chat-messages).

```vue
<template>
  <UChatMessages :messages="messages" :status="status">
    <template #files="{ parts }">
      <UChatAttachment
        v-for="(part, index) in parts"
        :key="index"
        :name="part.filename"
        :type="part.mediaType"
        :url="part.url"
      />
    </template>
  </UChatMessages>
</template>
```
::

### Status

Use the `status` prop to show that the file is `uploading` or failed to upload with `error`. Defaults to `idle`.

::component-code
---
ignore:
  - name
  - type
props:
  status: 'uploading'
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Removable

Use the `removable` prop to display a button that emits a `remove` event.

::component-code
---
ignore:
  - name
  - type
props:
  removable: true
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Icon

Use the `icon` prop to customize the [Icon](/docs/components/icon) displayed for files that are not images. Defaults to `i-lucide-file`.

::component-code
---
ignore:
  - name
  - type
props:
  icon: 'i-lucide-file-text'
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

::framework-only
#nuxt
:::tip{to="/docs/getting-started/integrations/icons/nuxt#theme"}
You can customize this icon globally in your `app.config.ts` under `ui.icons.file` key.
:::

#vue
:::tip{to="/docs/getting-started/integrations/icons/vue#theme"}
You can customize this icon globally in your `vite.config.ts` under `ui.icons.file` key.
:::
::

## API

### Props

:component-props

### Emits

:component-emits

## Theme

:component-theme

## Changelog

:component-changelog
