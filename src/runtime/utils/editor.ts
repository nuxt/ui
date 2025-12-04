import type { Editor, Mark } from '@tiptap/vue-3'
import type { Middleware } from '@floating-ui/dom'
import { flip, shift, offset, size, autoPlacement, hide, inline } from '@floating-ui/dom'
import { isArrayOfArray } from './index'
import type { EditorHandlers, EditorCustomHandlers, EditorItem, FloatingUIOptions } from '../types/editor'

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
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: (editor: Editor) => isNodeTypeSelected(editor, ['image']) || editor.isActive('code')
  }
}

export function createSetHandler(name: string) {
  const fnName = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[fnName](),
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: (editor: Editor) => isNodeTypeSelected(editor, ['image']) || editor.isActive('code')
  }
}

export function createSimpleHandler(name: string) {
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[name](),
    execute: (editor: Editor) => (editor.chain() as any)[name](),
    isActive: () => false,
    isDisabled: undefined
  }
}

export function createMarkHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).toggleMark(cmd.mark),
    execute: (editor: Editor, cmd: any) => editor.chain().focus().toggleMark(cmd.mark),
    isActive: (editor: Editor, cmd: any) => editor.isActive(cmd.mark),
    isDisabled: (editor: Editor, cmd: any) => !isMarkInSchema(cmd.mark, editor) || isNodeTypeSelected(editor, ['image'])
  }
}

export function createTextAlignHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).setTextAlign(cmd.align),
    execute: (editor: Editor, cmd: any) => (editor.chain().focus() as any).setTextAlign(cmd.align),
    isActive: (editor: Editor, cmd: any) => editor.isActive({ textAlign: cmd.align }),
    isDisabled: (editor: Editor) => !isExtensionAvailable(editor, 'textAlign') || isNodeTypeSelected(editor, ['image', 'horizontalRule'])
  }
}

export function createHeadingHandler() {
  return {
    canExecute: (editor: Editor, cmd: any) => (editor.can() as any).toggleHeading({ level: cmd.level }),
    execute: (editor: Editor, cmd: any) => editor.chain().focus().toggleHeading({ level: cmd.level }),
    isActive: (editor: Editor, cmd: any) => editor.isActive('heading', { level: cmd.level }),
    isDisabled: (editor: Editor) => isNodeTypeSelected(editor, ['image']) || editor.isActive('code')
  }
}

export function createLinkHandler() {
  return {
    canExecute: (editor: Editor) => {
      // Can execute if we can set a link or unset a link
      return (editor.can() as any).setLink({ href: '' }) || (editor.can() as any).unsetLink()
    },
    execute: (editor: Editor, cmd: any) => {
      const chain = editor.chain()
      const previousUrl = editor.getAttributes('link').href

      // If link is already active, unset it
      if (previousUrl) {
        return chain.focus().unsetLink()
      }

      // If href is provided in cmd, use it
      if (cmd?.href) {
        return chain.focus().setLink({ href: cmd.href })
      }

      // Otherwise prompt for URL
      const href = prompt('Enter the URL:')
      if (href) {
        return chain.focus().setLink({ href })
      }

      return chain
    },
    isActive: (editor: Editor) => editor.isActive('link'),
    isDisabled: (editor: Editor) => {
      if (!isExtensionAvailable(editor, 'link') || isNodeTypeSelected(editor, ['image'])) {
        return true
      }
      // Disable if no text is selected and no link is active
      const { selection } = editor.state
      return selection.empty && !editor.isActive('link')
    }
  }
}

export function createImageHandler() {
  return {
    canExecute: (editor: Editor) => {
      return (editor.can() as any).setImage({ src: '' })
    },
    execute: (editor: Editor, cmd: any) => {
      const chain = editor.chain().focus()

      // If src is provided in cmd, use it
      if (cmd?.src) {
        return chain.setImage({ src: cmd.src })
      }

      // Otherwise prompt for URL
      const src = prompt('Enter the image URL:')
      if (src) {
        return chain.setImage({ src })
      }

      return chain
    },
    isActive: (editor: Editor) => editor.isActive('image'),
    isDisabled: (editor: Editor) => {
      return !isExtensionAvailable(editor, 'image')
    }
  }
}

export function createListHandler(listType: 'bulletList' | 'orderedList') {
  const fnName = listType === 'bulletList' ? 'toggleBulletList' : 'toggleOrderedList'

  return {
    canExecute: (editor: Editor) => {
      return (editor.can() as any)[fnName]() || editor.isActive('bulletList') || editor.isActive('orderedList')
    },
    execute: (editor: Editor) => {
      const { state } = editor
      const { selection } = state
      let chain = editor.chain().focus()

      // Handle NodeSelection (e.g., from drag handle)
      if ((selection as any).node) {
        const node = (selection as any).node
        const firstChild = node.firstChild?.firstChild
        const lastChild = node.lastChild?.lastChild

        const from = firstChild
          ? selection.from + firstChild.nodeSize
          : selection.from + 1
        const to = lastChild
          ? selection.to - lastChild.nodeSize
          : selection.to - 1

        chain = chain.setTextSelection({ from, to }).clearNodes()
      }

      if (editor.isActive(listType)) {
        // Unwrap list
        return chain
          .liftListItem('listItem')
          .lift('bulletList')
          .lift('orderedList')
          .selectTextblockEnd()
      }

      // Wrap in list and normalize selection
      return (chain as any)[fnName]().selectTextblockEnd()
    },
    isActive: (editor: Editor) => editor.isActive(listType),
    isDisabled: (editor: Editor) => isNodeTypeSelected(editor, ['image']) || editor.isActive('code')
  }
}

export function createMoveHandler(direction: 'up' | 'down') {
  return {
    canExecute: (editor: Editor, cmd: any) => {
      if (cmd?.pos == null) return false
      const node = editor.state.doc.nodeAt(cmd.pos)
      if (!node) return false
      const $pos = editor.state.doc.resolve(cmd.pos)
      const parent = $pos.parent
      const index = $pos.index()
      return direction === 'up' ? index > 0 : index < parent.childCount - 1
    },
    execute: (editor: Editor, cmd: any) => {
      if (cmd?.pos == null) return editor.chain()
      const node = editor.state.doc.nodeAt(cmd.pos)
      if (!node) return editor.chain()

      const $pos = editor.state.doc.resolve(cmd.pos)
      const parent = $pos.parent
      const index = $pos.index()

      if (direction === 'up' && index > 0) {
        const prevNode = parent.child(index - 1)
        const targetPos = cmd.pos - prevNode.nodeSize
        return editor.chain().focus()
          .deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize })
          .insertContentAt(targetPos, node.toJSON())
      }

      if (direction === 'down' && index < parent.childCount - 1) {
        const nextNode = parent.child(index + 1)
        const targetPos = cmd.pos + nextNode.nodeSize
        return editor.chain().focus()
          .deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize })
          .insertContentAt(targetPos, node.toJSON())
      }

      return editor.chain()
    },
    isActive: () => false,
    isDisabled: undefined
  }
}

export function createHandlers(): EditorHandlers {
  return {
    mark: createMarkHandler(),
    textAlign: createTextAlignHandler(),
    heading: createHeadingHandler(),
    link: createLinkHandler(),
    image: createImageHandler(),
    blockquote: createToggleHandler('blockquote'),
    bulletList: createListHandler('bulletList'),
    orderedList: createListHandler('orderedList'),
    codeBlock: createToggleHandler('codeBlock'),
    horizontalRule: createSetHandler('horizontalRule'),
    paragraph: createSetHandler('paragraph'),
    undo: createSimpleHandler('undo'),
    redo: createSimpleHandler('redo'),
    clearFormatting: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos)
          return !!node
        }
        return editor.can().clearNodes() || editor.can().unsetAllMarks()
      },
      execute: (editor: Editor, cmd: any) => {
        // If position is provided (from drag handle), select the node content first
        if (cmd?.pos != null) {
          const node = editor.state.doc.nodeAt(cmd.pos)
          if (!node) return editor.chain()

          const from = cmd.pos + 1
          const to = cmd.pos + node.nodeSize - 1

          return editor.chain()
            .focus()
            .setTextSelection({ from, to })
            .clearNodes()
            .unsetAllMarks()
        }

        // Otherwise, clear formatting on current selection
        return editor.chain().focus().clearNodes().unsetAllMarks()
      },
      isActive: () => false,
      isDisabled: undefined
    },
    duplicate: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return false
        const node = editor.state.doc.nodeAt(cmd.pos)
        return !!node
      },
      execute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return editor.chain()
        const node = editor.state.doc.nodeAt(cmd.pos)
        if (!node) return editor.chain()
        return editor.chain().focus().insertContentAt(cmd.pos + node.nodeSize, node.toJSON())
      },
      isActive: () => false,
      isDisabled: undefined
    },
    delete: {
      canExecute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return false
        const node = editor.state.doc.nodeAt(cmd.pos)
        return !!node
      },
      execute: (editor: Editor, cmd: any) => {
        if (cmd?.pos == null) return editor.chain()
        const node = editor.state.doc.nodeAt(cmd.pos)
        if (!node) return editor.chain()
        return editor.chain().focus().deleteRange({ from: cmd.pos, to: cmd.pos + node.nodeSize })
      },
      isActive: () => false,
      isDisabled: undefined
    },
    moveUp: createMoveHandler('up'),
    moveDown: createMoveHandler('down'),
    suggestion: {
      canExecute: () => true,
      execute: (editor: Editor, cmd?: any) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        if (cmd?.pos !== undefined) {
          // When triggered from drag handle, insert after the current node
          const node = state.doc.nodeAt(cmd.pos)
          if (node) {
            const insertPos = cmd.pos + node.nodeSize
            return editor.chain().focus().insertContentAt(insertPos, { type: 'paragraph', content: [{ type: 'text', text: '/' }] })
          }
        }

        // When triggered from toolbar/elsewhere, insert new paragraph after current block
        const currentNode = $from.node($from.depth)
        const currentNodePos = $from.before($from.depth)
        const insertPos = currentNodePos + currentNode.nodeSize

        return editor.chain().focus().insertContentAt(insertPos, { type: 'paragraph', content: [{ type: 'text', text: '/' }] })
      },
      isActive: () => false,
      isDisabled: undefined
    },
    mention: {
      canExecute: () => true,
      execute: (editor: Editor) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        // Check if there's text before the cursor
        const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 1), $from.parentOffset, undefined, ' ')
        const needsSpace = textBefore && textBefore !== ' '

        return editor.chain().focus().insertContent(needsSpace ? ' @' : '@')
      },
      isActive: () => false,
      isDisabled: undefined
    },
    emoji: {
      canExecute: () => true,
      execute: (editor: Editor) => {
        const { state } = editor
        const { selection } = state
        const { $from } = selection

        // Check if there's text before the cursor
        const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 1), $from.parentOffset, undefined, ' ')
        const needsSpace = textBefore && textBefore !== ' '

        return editor.chain().focus().insertContent(needsSpace ? ' :' : ':')
      },
      isActive: () => false,
      isDisabled: undefined
    }
  }
}

export function mapEditorItems(
  editor: Editor,
  items: (Partial<EditorItem> & Record<string, any>)[] | (Partial<EditorItem> & Record<string, any>)[][],
  customHandlers?: EditorCustomHandlers
): any[] | any[][] {
  const handlers = { ...createHandlers(), ...customHandlers }

  // Handle nested arrays [[...], [...]]
  if (isArrayOfArray(items)) {
    return items.map(group =>
      mapEditorItems(editor, group, customHandlers)
    ) as any[][]
  }

  return items.filter(Boolean).map((item) => {
    // Pass through items with type (label, separator, etc)
    if ('type' in item) {
      return item
    }

    const { kind, children, ...rest } = item

    // Recursively process children if present
    const processedChildren = children?.length
      ? mapEditorItems(editor, children as any, customHandlers) as any[]
      : undefined

    // Handle action items with handlers
    if (kind) {
      const handler = handlers[kind]
      if (!handler) {
        return {
          ...rest,
          children: processedChildren
        }
      }

      return {
        ...rest,
        children: processedChildren,
        disabled: handler.isDisabled?.(editor, item) || !handler.canExecute(editor, item),
        active: handler.isActive(editor, item),
        onSelect: () => handler.execute(editor, item).run()
      }
    }

    // Pass through items without kind but with children
    return { ...rest, children: processedChildren }
  })
}

export function buildFloatingUIMiddleware(options: FloatingUIOptions): Middleware[] {
  const middleware: Middleware[] = []

  if (options.offset) {
    middleware.push(offset(typeof options.offset !== 'boolean' ? options.offset : undefined))
  }

  if (options.flip) {
    middleware.push(flip(typeof options.flip !== 'boolean' ? options.flip : undefined))
  }

  if (options.shift) {
    middleware.push(shift(typeof options.shift !== 'boolean' ? options.shift : undefined))
  }

  if (options.size) {
    middleware.push(size(typeof options.size !== 'boolean' ? options.size : undefined))
  }

  if (options.autoPlacement) {
    middleware.push(autoPlacement(typeof options.autoPlacement !== 'boolean' ? options.autoPlacement : undefined))
  }

  if (options.hide) {
    middleware.push(hide(typeof options.hide !== 'boolean' ? options.hide : undefined))
  }

  if (options.inline) {
    middleware.push(inline(typeof options.inline !== 'boolean' ? options.inline : undefined))
  }

  return middleware
}
