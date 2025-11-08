import type { Editor, Mark } from '@tiptap/vue-3'

export interface EditorHandler {
  canExecute: (editor: Editor, cmd?: any) => boolean
  execute: (chain: any, cmd?: any) => any
  isActive: (editor: Editor, cmd?: any) => boolean
  isDisabled?: (editor: Editor, cmd?: any) => boolean
}

export type EditorActionType
  = | { kind: 'mark', mark: 'bold' | 'italic' | 'strike' | 'code' | 'underline' }
    | { kind: 'textAlign', align: 'left' | 'center' | 'right' | 'justify' }
    | { kind: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6 }
    | { kind: 'blockquote' | 'bulletList' | 'orderedList' | 'codeBlock' | 'horizontalRule' | 'paragraph' | 'undo' | 'redo' | 'mention' | 'emoji' }

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

export function createToggleHandler(name: string) {
  const fnName = `toggle${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[fnName](),
    execute: (chain: any) => chain.focus()[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: undefined
  }
}

export function createSetHandler(name: string) {
  const fnName = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[fnName](),
    execute: (chain: any) => chain.focus()[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: undefined
  }
}

export function createSimpleHandler(name: string) {
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[name](),
    execute: (chain: any) => chain[name](),
    isActive: () => false,
    isDisabled: undefined
  }
}

export function createMarkHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).toggleMark(cmd.mark),
    execute: (chain: any, cmd: any) => chain.focus().toggleMark(cmd.mark),
    isActive: (editor: Editor, cmd: any) => editor.isActive(cmd.mark),
    isDisabled: (editor: Editor, cmd: any) => !isMarkInSchema(cmd.mark, editor) || isNodeTypeSelected(editor, ['image'])
  }
}

export function createTextAlignHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).setTextAlign(cmd.align),
    execute: (chain: any, cmd: any) => chain.focus().setTextAlign(cmd.align),
    isActive: (editor: Editor, cmd: any) => editor.isActive({ textAlign: cmd.align }),
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'textAlign') || isNodeTypeSelected(editor, ['image', 'horizontalRule'])
  }
}

export function createHeadingHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).toggleHeading({ level: cmd.level }),
    execute: (chain: any, cmd: any) => chain.focus().toggleHeading({ level: cmd.level }),
    isActive: (editor: Editor, cmd: any) => editor.isActive('heading', { level: cmd.level }),
    isDisabled: undefined
  }
}

export function createHandlers(): Record<EditorActionType['kind'], EditorHandler> {
  return {
    mark: createMarkHandler(),
    textAlign: createTextAlignHandler(),
    heading: createHeadingHandler(),
    blockquote: createToggleHandler('blockquote'),
    bulletList: createToggleHandler('bulletList'),
    orderedList: createToggleHandler('orderedList'),
    codeBlock: createToggleHandler('codeBlock'),
    horizontalRule: createSetHandler('horizontalRule'),
    paragraph: createSetHandler('paragraph'),
    undo: createSimpleHandler('undo'),
    redo: createSimpleHandler('redo'),
    mention: {
      canExecute: () => true,
      execute: (chain: any) => chain.insertContent('@'),
      isActive: () => false,
      isDisabled: undefined
    },
    emoji: {
      canExecute: () => true,
      execute: (chain: any) => chain.insertContent(':'),
      isActive: () => false,
      isDisabled: undefined
    }
  }
}
