# Editor Layout

Build a rich text editor with toolbars, slash commands, mentions, and drag-and-drop.

## When to use

- Note-taking apps, CMS editors
- Collaborative editing interfaces
- Any rich text editing need (supports JSON, HTML, and Markdown)

## Component tree

```
UEditor
├── UEditorToolbar (fixed / bubble / floating)
├── UEditorDragHandle
├── UEditorSuggestionMenu
├── UEditorMentionMenu
└── UEditorEmojiMenu
```

## Basic editor

```vue
<script setup lang="ts">
const content = ref({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Hello World' }]
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Start writing...' }]
    }
  ]
})
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content">
    <UEditorToolbar :editor="editor" />
    <UEditorSuggestionMenu :editor="editor" />
    <UEditorMentionMenu
      :editor="editor"
      :items="[
        { label: 'Benjamin', avatar: { src: 'https://github.com/benjamincanac.png' } },
        { label: 'Sébastien', avatar: { src: 'https://github.com/atinux.png' } }
      ]"
    />
    <UEditorEmojiMenu :editor="editor" />
    <UEditorDragHandle :editor="editor" />
  </UEditor>
</template>
```

> If you encounter prosemirror-related errors, add prosemirror packages to `vite.optimizeDeps.include` in `nuxt.config.ts`.

## Key components

- `UEditor` — rich text editor. `v-model` accepts JSON (default), HTML, or Markdown via `content-type` prop. Default slot provides `{ editor, handlers }` — `editor` is the Tiptap instance, `handlers` contains action functions for toolbar/menus.
- `UEditorToolbar` — toolbar with `layout`: `'fixed'` (default), `'bubble'` (on selection), `'floating'` (on empty lines).
- `UEditorDragHandle` — block drag-and-drop handle.
- `UEditorSuggestionMenu` — slash command menu (type `/` to open).
- `UEditorMentionMenu` — `@` mention menu.
- `UEditorEmojiMenu` — emoji picker (type `:` to open).

## Toolbar modes

```vue
<!-- Fixed (default) — always visible at top -->
<UEditorToolbar :editor="editor" />

<!-- Bubble — appears on text selection -->
<UEditorToolbar :editor="editor" layout="bubble" />

<!-- Floating — appears on empty lines -->
<UEditorToolbar :editor="editor" layout="floating" />
```

## Content types

```vue
<!-- JSON (default) -->
<UEditor v-model="jsonContent" />

<!-- HTML -->
<UEditor v-model="htmlContent" content-type="html" />

<!-- Markdown -->
<UEditor v-model="markdownContent" content-type="markdown" />
```

## With document sidebar

Combine with Dashboard layout for a multi-document editor:

```vue [layouts/editor.vue]
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header>
        <UButton icon="i-lucide-plus" label="New document" block />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="documents.map(doc => ({
            label: doc.title,
            to: `/editor/${doc.id}`,
            icon: 'i-lucide-file-text'
          }))"
          orientation="vertical"
        />
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
```

```vue [pages/editor/[id].vue]
<script setup lang="ts">
definePageMeta({ layout: 'editor' })

const content = ref({ type: 'doc', content: [] })
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Editor">
        <template #right>
          <UButton label="Save" icon="i-lucide-save" />
        </template>
      </UDashboardNavbar>
    </template>

    <UContainer class="py-8">
      <UEditor v-slot="{ editor }" v-model="content">
        <UEditorToolbar :editor="editor" />
        <UEditorSuggestionMenu :editor="editor" />
        <UEditorEmojiMenu :editor="editor" />
        <UEditorDragHandle :editor="editor" />
      </UEditor>
    </UContainer>
  </UDashboardPanel>
</template>
```
