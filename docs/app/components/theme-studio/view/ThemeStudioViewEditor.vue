<script setup lang="ts">
import type { DropdownMenuItem, EditorEmojiMenuItem, EditorMentionMenuItem, EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import type { Editor, JSONContent } from '@tiptap/vue-3'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { upperFirst } from 'scule'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import EditorLinkPopover from '../../content/examples/editor/EditorLinkPopover.vue'

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

![Image Placeholder](/placeholder.jpeg)

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

// Formatting glyphs (headings, marks, blocks) stay lucide on purpose: no pack
// the studio offers covers bold/italic/underline/strike, so routing only the
// rest through `studioIcons` would split one toolbar row across two styles.
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
    icon: studioIcons.text
  }, ...headingItems, ...blockItems]
}], markItems, [{
  slot: 'link' as const,
  icon: studioIcons.link,
  tooltip: { text: 'Link' }
}]]

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
  type: 'label',
  label: 'Style'
}, {
  kind: 'paragraph',
  label: 'Paragraph',
  icon: studioIcons.text
}, ...headingItems, ...blockItems], [{
  type: 'label',
  label: 'Insert'
}, {
  kind: 'horizontalRule',
  label: 'Horizontal Rule',
  icon: 'i-lucide-separator-horizontal'
}]]

const mentionItems: EditorMentionMenuItem[] = [
  { label: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png', loading: 'lazy' as const } },
  { label: 'atinux', avatar: { src: 'https://github.com/atinux.png', loading: 'lazy' as const } },
  { label: 'danielroe', avatar: { src: 'https://github.com/danielroe.png', loading: 'lazy' as const } },
  { label: 'romhml', avatar: { src: 'https://github.com/romhml.png', loading: 'lazy' as const } }
]

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))

// Both menus portal out of the pane, which otherwise clips them.
const appendToBody = import.meta.client ? () => document.body : undefined

// CollaborationUsers without the Y.js room: initials tinted per user. The
// template squares these off with a hardcoded `rounded-md` in its app.config,
// which is exactly the kind of fixed radius the studio's control cannot move,
// so they stay the stock circles here.
const collaborators = [
  { alt: 'Anna Cooper', color: '#f97316' },
  { alt: 'Ben Rogers', color: '#0ea5e9' },
  { alt: 'Chloe Diaz', color: '#a855f7' }
]

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
    children: [{ kind: 'paragraph', label: 'Paragraph', icon: studioIcons.text }, ...headingItems, ...blockItems]
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
        :extensions="[Emoji]"
        placeholder="Write, type '/' for commands..."
        class="min-h-full"
        :ui="{ base: 'p-4 sm:p-14', content: 'max-w-4xl mx-auto' }"
      >
        <!-- The template's AppHeader: the container padding matches the editor's
             own, so the logo sits above the first character of the document. -->
        <UHeader
          :toggle="false"
          class="rounded-t-[inherit]"
          :ui="{ container: 'sm:px-14!', right: 'justify-end-safe overflow-x-auto py-2' }"
        >
          <template #left>
            <div class="flex items-center gap-1.5">
              <UIcon :name="studioIcons.editor" class="size-6 text-primary shrink-0" />
              <span class="text-xl font-bold text-highlighted">Editor</span>
            </div>
          </template>

          <template #right>
            <UAvatarGroup size="sm">
              <UTooltip v-for="user in collaborators" :key="user.alt" :text="user.alt">
                <UAvatar
                  :alt="user.alt"
                  :style="{ color: user.color }"
                  :ui="{ fallback: 'text-inherit font-bold' }"
                />
              </UTooltip>
            </UAvatarGroup>

            <USeparator orientation="vertical" class="h-7 shrink-0" />

            <UEditorToolbar :editor="editor" :items="toolbarItems" />

            <USeparator orientation="vertical" class="h-7 shrink-0" />

            <!-- Static: the studio toolbar owns color mode. -->
            <UButton color="neutral" variant="ghost" size="sm" aria-label="Color mode">
              <template #leading="{ ui }">
                <UIcon :name="appConfig.ui.icons.dark" :class="ui.leadingIcon({ class: 'hidden dark:inline-block' })" />
                <UIcon :name="appConfig.ui.icons.light" :class="ui.leadingIcon({ class: 'dark:hidden' })" />
              </template>
            </UButton>

            <UButton :icon="studioIcons.github" color="neutral" variant="ghost" size="sm" aria-label="GitHub" />
          </template>
        </UHeader>

        <UEditorToolbar
          :editor="editor"
          :items="bubbleToolbarItems"
          layout="bubble"
          :should-show="({ editor: instance, view, state }) => {
            if (instance.isActive('image')) {
              return false
            }
            return view.hasFocus() && !state.selection.empty
          }"
        >
          <template #link>
            <EditorLinkPopover :editor="editor" auto-open />
          </template>
        </UEditorToolbar>

        <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />

        <UEditorMentionMenu :editor="editor" :items="mentionItems" :append-to="appendToBody" />

        <UEditorEmojiMenu :editor="editor" :items="emojiItems" :append-to="appendToBody" />

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
        <div class="p-4 sm:p-14 max-w-4xl mx-auto space-y-4">
          <USkeleton class="h-8 w-2/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-5/6" />
          <USkeleton class="h-4 w-3/4" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
