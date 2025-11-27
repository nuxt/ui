<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Editor, Node } from '@tiptap/vue-3'
import { mapEditorItems } from '@nuxt/ui/utils/editor'

const value = ref(`Hover over the left side to see both drag handle and menu button.

Click the menu to see block actions.

Try duplicating or deleting a block.`)

const selectedNode = ref<{ node: Node | null, pos: number }>()

const getMenuItems = (editor: Editor): DropdownMenuItem[][] => {
  if (!selectedNode.value) return []

  return mapEditorItems(editor, [[{
    kind: 'duplicate',
    pos: selectedNode.value.pos,
    label: 'Duplicate',
    icon: 'i-lucide-copy'
  }], [{
    kind: 'delete',
    pos: selectedNode.value.pos,
    label: 'Delete',
    icon: 'i-lucide-trash'
  }]]) as DropdownMenuItem[][]
}
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle
      v-slot="{ ui }"
      :editor="editor"
      @node-change="selectedNode = $event"
    >
      <UButton
        icon="i-lucide-grip-vertical"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
      />

      <UDropdownMenu
        :items="getMenuItems(editor)"
        :content="{ side: 'right' }"
        :ui="{ content: 'w-48' }"
      >
        <UButton
          icon="i-lucide-more-vertical"
          color="neutral"
          variant="ghost"
          size="sm"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
