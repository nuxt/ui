# Editor Layout

Build a rich text editor with toolbars, slash commands, mentions, and drag-and-drop.

## Component tree

```
UApp
├── UHeader
├── UMain
│   └── NuxtPage
│       └── UContainer
│           └── UEditor
│               ├── UEditorToolbar (fixed / bubble / floating)
│               ├── UEditorDragHandle
│               ├── UEditorSuggestionMenu
│               ├── UEditorMentionMenu
│               └── UEditorEmojiMenu
└── UFooter
```

## Page

```vue [pages/editor.vue]
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
  <UPage>
    <UPageHeader title="Editor">
      <template #actions>
        <UButton label="Save" icon="i-lucide-save" />
      </template>
    </UPageHeader>

    <UPageBody>
      <UEditor v-model="content">
        <UEditorToolbar />
        <UEditorDragHandle />
        <UEditorSuggestionMenu />
        <UEditorMentionMenu
          :items="[
            { label: 'Benjamin', avatar: { src: 'https://github.com/benjamincanac.png' } },
            { label: 'Sébastien', avatar: { src: 'https://github.com/atinux.png' } }
          ]"
        />
        <UEditorEmojiMenu />
      </UEditor>
    </UPageBody>
  </UPage>
</template>
```

> If you encounter prosemirror-related errors, add prosemirror packages to `vite.optimizeDeps.include` in `nuxt.config.ts`.

## Key components

- `UEditor` — Rich text editor (`v-model` accepts JSON, HTML, or markdown via `content-type` prop)
- `UEditorToolbar` — Toolbar with `layout`: `'fixed'` (default), `'bubble'` (on selection), `'floating'` (on empty lines)
- `UEditorDragHandle` — Block drag-and-drop handle
- `UEditorSuggestionMenu` — Slash command menu
- `UEditorMentionMenu` — @ mention menu
- `UEditorEmojiMenu` — Emoji picker

## Toolbar modes

```vue
<!-- Fixed (default) -->
<UEditor v-model="content">
  <UEditorToolbar />
</UEditor>

<!-- Bubble (appears on text selection) -->
<UEditor v-model="content">
  <UEditorToolbar layout="bubble" />
</UEditor>

<!-- Floating (appears on empty lines) -->
<UEditor v-model="content">
  <UEditorToolbar layout="floating" />
</UEditor>
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

Combine with Dashboard components for a multi-document editor with a sidebar.

```vue [layouts/editor.vue]
<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable>
      <template #header>
        <UButton icon="i-lucide-plus" label="New document" block />
      </template>

      <template #default>
        <UNavigationMenu
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
      <UEditor v-model="content">
        <UEditorToolbar />
        <UEditorDragHandle />
        <UEditorSuggestionMenu />
        <UEditorEmojiMenu />
      </UEditor>
    </UContainer>
  </UDashboardPanel>
</template>
```
