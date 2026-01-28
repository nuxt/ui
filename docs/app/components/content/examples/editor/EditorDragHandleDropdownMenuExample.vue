<script setup lang="ts">
import { upperFirst } from 'scule'
import type { DropdownMenuItem } from '@nuxt/ui'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import type { Editor, JSONContent } from '@tiptap/vue-3'

const value = ref(`Hover over the left side to see both drag handle and menu button.

Click the menu to see block actions. Try duplicating or deleting a block.`)

const selectedNode = ref<{ node: JSONContent, pos: number }>()

const items = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value?.node?.type) {
    return []
  }

  return mapEditorItems(editor, [[
    {
      type: 'label',
      label: upperFirst(selectedNode.value.node.type)
    },
    {
      label: 'Turn into',
      icon: 'i-lucide-repeat-2',
      children: [
        { kind: 'paragraph', label: 'Paragraph', icon: 'i-lucide-type' },
        { kind: 'heading', level: 1, label: 'Heading 1', icon: 'i-lucide-heading-1' },
        { kind: 'heading', level: 2, label: 'Heading 2', icon: 'i-lucide-heading-2' },
        { kind: 'heading', level: 3, label: 'Heading 3', icon: 'i-lucide-heading-3' },
        { kind: 'heading', level: 4, label: 'Heading 4', icon: 'i-lucide-heading-4' },
        { kind: 'bulletList', label: 'Bullet List', icon: 'i-lucide-list' },
        { kind: 'orderedList', label: 'Ordered List', icon: 'i-lucide-list-ordered' },
        { kind: 'blockquote', label: 'Blockquote', icon: 'i-lucide-text-quote' },
        { kind: 'codeBlock', label: 'Code Block', icon: 'i-lucide-square-code' }
      ]
    },
    {
      kind: 'clearFormatting',
      pos: selectedNode.value?.pos,
      label: 'Reset formatting',
      icon: 'i-lucide-rotate-ccw'
    }
  ], [
    {
      kind: 'duplicate',
      pos: selectedNode.value?.pos,
      label: 'Duplicate',
      icon: 'i-lucide-copy'
    },
    {
      label: 'Copy to clipboard',
      icon: 'i-lucide-clipboard',
      onSelect: async () => {
        if (!selectedNode.value) return

        const pos = selectedNode.value.pos
        const node = editor.state.doc.nodeAt(pos)
        if (node) {
          await navigator.clipboard.writeText(node.textContent)
        }
      }
    }
  ], [
    {
      kind: 'moveUp',
      pos: selectedNode.value?.pos,
      label: 'Move up',
      icon: 'i-lucide-arrow-up'
    },
    {
      kind: 'moveDown',
      pos: selectedNode.value?.pos,
      label: 'Move down',
      icon: 'i-lucide-arrow-down'
    }
  ], [
    {
      kind: 'delete',
      pos: selectedNode.value?.pos,
      label: 'Delete',
      icon: 'i-lucide-trash'
    }
  ]]) as DropdownMenuItem[][]
}
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="value"
    content-type="markdown"
    class="w-full min-h-19"
  >
    <UEditorDragHandle v-slot="{ ui }" :editor="editor" @node-change="selectedNode = $event">
      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="items(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-48', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          icon="i-lucide-grip-vertical"
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
