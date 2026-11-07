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

The ChatAttachment component displays a file with its name and a description, next to an image preview or an icon.

::note
This component is automatically used by the [`ChatPrompt`](/docs/components/chat-prompt#files) component to list the files bound with `v-model:files`.
::

### File

Use the `file` prop to display a `File`, such as one picked by the user. Its name, type and size are read from it and images are previewed through an object URL.

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

Use the `url` prop to preview an image. The image is displayed when `type` is an image media type, and its `name` is used as the alternative text.

::component-code
---
prettier: true
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

### Description

Use the `description` prop to set the text under the name. Defaults to the file extension and, with the `file` prop, its size.

::component-code
---
prettier: true
ignore:
  - name
  - type
props:
  description: 'Uploaded 2 minutes ago'
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Status

Use the `status` prop to show that the file is `uploading` or failed to upload with `error`. Defaults to `idle`.

::note
While `uploading`, the name shimmers, an image is dimmed and a file icon turns into a spinner. Pass the progress or, with `error`, the reason to the `description` prop.
::

::component-code
---
prettier: true
ignore:
  - name
  - type
props:
  status: 'uploading'
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Orientation

Use the `orientation` prop to change the layout of the attachment. Defaults to `horizontal`, `vertical` gives an image a large preview.

::component-code
---
prettier: true
ignore:
  - name
  - type
  - url
props:
  orientation: 'vertical'
  name: 'landscape.jpg'
  type: 'image/jpeg'
  url: 'https://picsum.photos/id/1015/200'
---
::

### Variant

Use the `variant` prop to change the style of the attachment. Defaults to `card`, `thumbnail` only displays the image or file icon with the remove button on its corner and the name available to screen readers. Combine it with the `size` prop for a larger preview, from `40px` with `xs` to `120px` with `xl`.

::component-code
---
prettier: true
ignore:
  - name
  - type
  - url
  - removable
props:
  variant: 'thumbnail'
  name: 'landscape.jpg'
  type: 'image/jpeg'
  url: 'https://picsum.photos/id/1015/200'
  removable: true
---
::

::note
The `orientation` prop only applies to the `card` variant.
::

### Size

Use the `size` prop to change the size of the attachment. Defaults to `md`.

::component-code
---
prettier: true
ignore:
  - name
  - type
props:
  size: 'sm'
  name: 'quarterly-report.pdf'
  type: 'application/pdf'
---
::

### Removable

Use the `removable` prop to display a button that emits a `remove` event.

::component-code
---
prettier: true
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
prettier: true
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
