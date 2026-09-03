<script setup lang="ts">
import type { DropdownMenuItem, EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

/**
 * Self-contained replica of the official Nuxt UI Editor template
 * (github.com/nuxt-ui-templates/editor): header chrome with a fixed
 * toolbar, a bubble toolbar on selection, slash commands and a drag
 * handle over a markdown document. Collaboration, AI completions,
 * image upload, tables and task lists are omitted, they need server
 * routes or extensions the docs app doesn't ship.
 */

const content = ref(`# Nuxt Editor Template

A Notion-like WYSIWYG editor built with [Vue](https://vuejs.org/) & [Nuxt](https://nuxt.com/), and themed live by this studio.

> Select some text to reveal the bubble toolbar, or type \`/\` on an empty line for quick commands.

---

## Rich Text Editing

Full formatting support with **bold**, *italic*, <u>underline</u>, ~~strikethrough~~, and \`inline code\`.

### Lists

1. Numbered lists for sequential items
2. With automatic numbering

- Bullet lists work too
  - With nested items
  - At multiple levels

### Code Blocks

\`\`\`vue
<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown">
    <UEditorToolbar :editor="editor" :items="items" />
  </UEditor>
</template>
\`\`\`

## Features

### Bubble & Fixed Toolbars

Select text to see the bubble toolbar with formatting options. The fixed toolbar at the top provides quick access to common actions.

### Drag Handle

Use the drag handle on the left side of any block to reorder, duplicate, delete, or convert between block types.

### Slash Commands

Type \`/\` anywhere to access quick insertion commands for headings, lists, code blocks and more.

---

Every heading, quote and code block above is styled by the semantic tokens you are editing right now.
`)

const headingItems = [1, 2, 3, 4].map(level => ({
  kind: 'heading' as const,
  level,
  label: `Heading ${level}`,
  icon: `i-lucide-heading-${level}`
}))

const blockItems = [{
  kind: 'bulletList' as const,
  label: 'Bullet List',
  icon: studioIcons.list
}, {
  kind: 'orderedList' as const,
  label: 'Ordered List',
  icon: 'i-lucide-list-ordered'
}, {
  kind: 'blockquote' as const,
  label: 'Blockquote',
  icon: 'i-lucide-text-quote'
}, {
  kind: 'codeBlock' as const,
  label: 'Code Block',
  icon: 'i-lucide-square-code'
}]

const markItems = [{
  kind: 'mark' as const,
  mark: 'bold' as const,
  icon: 'i-lucide-bold',
  tooltip: { text: 'Bold' }
}, {
  kind: 'mark' as const,
  mark: 'italic' as const,
  icon: 'i-lucide-italic',
  tooltip: { text: 'Italic' }
}, {
  kind: 'mark' as const,
  mark: 'underline' as const,
  icon: 'i-lucide-underline',
  tooltip: { text: 'Underline' }
}, {
  kind: 'mark' as const,
  mark: 'strike' as const,
  icon: 'i-lucide-strikethrough',
  tooltip: { text: 'Strikethrough' }
}, {
  kind: 'mark' as const,
  mark: 'code' as const,
  icon: 'i-lucide-code',
  tooltip: { text: 'Code' }
}]

const toolbarItems: EditorToolbarItem[][] = [[{
  kind: 'undo',
  icon: studioIcons.undo,
  tooltip: { text: 'Undo' }
}, {
  kind: 'redo',
  icon: studioIcons.redo,
  tooltip: { text: 'Redo' }
}], [{
  icon: studioIcons.heading,
  tooltip: { text: 'Headings' },
  content: { align: 'start' },
  items: headingItems
}, ...blockItems.map(({ label, ...item }) => ({ ...item, tooltip: { text: label } }))], markItems]

const bubbleToolbarItems: EditorToolbarItem[][] = [[{
  label: 'Turn into',
  trailingIcon: appConfig.ui.icons.chevronDown,
  activeColor: 'neutral',
  activeVariant: 'ghost',
  tooltip: { text: 'Turn into' },
  content: { align: 'start' },
  ui: { label: 'text-xs' },
  items: [{
    type: 'label',
    label: 'Turn into'
  }, {
    kind: 'paragraph',
    label: 'Paragraph',
    icon: 'i-lucide-type'
  }, ...headingItems, ...blockItems]
}], markItems]

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
  type: 'label',
  label: 'Style'
}, {
  kind: 'paragraph',
  label: 'Paragraph',
  icon: 'i-lucide-type'
}, ...headingItems, ...blockItems], [{
  type: 'label',
  label: 'Insert'
}, {
  kind: 'horizontalRule',
  label: 'Horizontal Rule',
  icon: 'i-lucide-separator-horizontal'
}]]

const selectedNode = ref<{ node: JSONContent, pos: number }>()

function dragHandleItems(editor: Editor): DropdownMenuItem[][] {
  if (!selectedNode.value?.node?.type) {
    return []
  }

  const pos = selectedNode.value.pos

  return mapEditorItems(editor, [[{
    type: 'label',
    label: upperFirst(selectedNode.value.node.type)
  }, {
    label: 'Turn into',
    icon: 'i-lucide-repeat-2',
    children: [{ kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' }, ...headingItems, ...blockItems]
  }], [{
    kind: 'duplicate',
    pos,
    label: 'Duplicate',
    icon: appConfig.ui.icons.copy
  }, {
    kind: 'moveUp',
    pos,
    label: 'Move up',
    icon: appConfig.ui.icons.arrowUp
  }, {
    kind: 'moveDown',
    pos,
    label: 'Move down',
    icon: appConfig.ui.icons.arrowDown
  }], [{
    kind: 'delete',
    pos,
    label: 'Delete',
    icon: studioIcons.trash
  }]]) as DropdownMenuItem[][]
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-default">
    <ClientOnly>
      <UEditor
        v-slot="{ editor, handlers }"
        v-model="content"
        content-type="markdown"
        placeholder="Write, type '/' for commands..."
        class="min-h-full"
        :ui="{ base: 'p-4 sm:p-10', content: 'max-w-3xl mx-auto' }"
      >
        <header class="sticky top-0 z-10 h-14 flex items-center gap-2 border-b border-default bg-default/75 backdrop-blur px-4">
          <div class="flex items-center gap-1.5 shrink-0">
            <UIcon name="i-lucide-notebook-pen" class="size-5 text-primary" />
            <span class="text-base font-bold text-highlighted hidden sm:inline">Editor</span>
          </div>

          <div class="flex-1 min-w-0 flex justify-end overflow-x-auto py-1">
            <UEditorToolbar :editor="editor" :items="toolbarItems" />
          </div>

          <USeparator orientation="vertical" class="h-7 shrink-0" />

          <div class="flex items-center gap-2 shrink-0">
            <UAvatarGroup size="2xs">
              <UAvatar alt="Anna Cooper" chip />
              <UAvatar alt="Ben Rogers" chip />
            </UAvatarGroup>

            <UButton
              label="Share"
              :icon="studioIcons.users"
              color="neutral"
              variant="outline"
              size="sm"
              class="hidden sm:inline-flex"
            />
          </div>
        </header>

        <UEditorToolbar
          :editor="editor"
          :items="bubbleToolbarItems"
          layout="bubble"
          :should-show="({ view, state }) => view.hasFocus() && !state.selection.empty"
        />

        <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

        <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="selectedNode = $event">
          <UButton
            :icon="appConfig.ui.icons.plus"
            color="neutral"
            variant="ghost"
            size="sm"
            :class="ui.handle()"
            aria-label="Insert block"
            @click="(e) => {
              e.stopPropagation()
              const selected = onClick()
              handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
            }"
          />

          <UDropdownMenu
            v-slot="{ open }"
            :modal="false"
            :items="dragHandleItems(editor)"
            :content="{ side: 'left' }"
            :ui="{ content: 'w-48', label: 'text-xs' }"
            @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
          >
            <UButton
              color="neutral"
              variant="ghost"
              active-variant="soft"
              size="sm"
              :icon="appConfig.ui.icons.drag"
              :active="open"
              :class="ui.handle()"
              aria-label="Block actions"
            />
          </UDropdownMenu>
        </UEditorDragHandle>
      </UEditor>

      <template #fallback>
        <div class="p-4 sm:p-10 max-w-3xl mx-auto space-y-4">
          <USkeleton class="h-8 w-2/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-3/4" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
