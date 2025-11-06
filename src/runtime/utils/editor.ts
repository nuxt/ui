import type { Editor, Mark } from '@tiptap/vue-3'

export function isMarkInSchema(mark: string | Mark, editor: Editor | null): boolean {
  if (!editor?.schema) {
    return false
  }

  const markName = typeof mark === 'string' ? mark : mark.name
  return editor.schema.spec.marks.get(markName) !== undefined
}

export function isNodeTypeSelected(editor: Editor | null, nodeTypes: string[]): boolean {
  if (!editor) {
    return false
  }

  const { selection } = editor.state
  const { $from, to } = selection

  return nodeTypes.some((nodeType) => {
    return editor.state.doc.nodesBetween($from.pos, to, (node) => {
      return node.type.name === nodeType
    })
  })
}

export function isExtensionAvailable(editor: Editor | null, extensionName: string): boolean {
  if (!editor) {
    return false
  }

  return editor.extensionManager.extensions.some(ext => ext.name === extensionName)
}
