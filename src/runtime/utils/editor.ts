import type { Editor, Mark } from '@tiptap/vue-3'
import type { Middleware } from '@floating-ui/dom'
import { flip, shift, offset, size, autoPlacement, hide, inline } from '@floating-ui/dom'
import { isArrayOfArray } from './index'
import type { EditorHandlers, EditorItem, FloatingUIOptions } from '../types/editor'

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
    isDisabled: undefined
  }
}

export function createSetHandler(name: string) {
  const fnName = `set${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return {
    canExecute: (editor: Editor) => (editor.can() as any)[fnName](),
    execute: (editor: Editor) => (editor.chain().focus() as any)[fnName](),
    isActive: (editor: Editor) => editor.isActive(name),
    isDisabled: undefined
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
    isDisabled: undefined
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

export function createHandlers(): EditorHandlers {
  return {
    mark: createMarkHandler(),
    textAlign: createTextAlignHandler(),
    heading: createHeadingHandler(),
    link: createLinkHandler(),
    image: createImageHandler(),
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
      execute: (editor: Editor) => editor.chain().insertContent('@'),
      isActive: () => false,
      isDisabled: undefined
    },
    emoji: {
      canExecute: () => true,
      execute: (editor: Editor) => editor.chain().insertContent(':'),
      isActive: () => false,
      isDisabled: undefined
    }
  }
}

export function mapEditorItems(
  editor: Editor,
  items: (Partial<EditorItem> & Record<string, any>)[] | (Partial<EditorItem> & Record<string, any>)[][],
  customHandlers?: EditorHandlers
): any[] | any[][] {
  const handlers = { ...createHandlers(), ...customHandlers }

  // Handle nested arrays [[...], [...]]
  if (isArrayOfArray(items)) {
    return items.map(group =>
      mapEditorItems(editor, group, customHandlers)
    ) as any[][]
  }

  return items.filter(Boolean).map((config) => {
    // Pass through items with type (label, separator, etc)
    if ('type' in config) {
      return config
    }

    const { kind, children, ...rest } = config

    // Recursively process children if present
    const processedChildren = children
      ? mapEditorItems(editor, children as any, customHandlers) as any[]
      : undefined

    // Handle action items with handlers
    if (kind) {
      const handler = handlers[kind]

      if (!handler) {
        return { ...rest, children: processedChildren }
      }

      return {
        ...rest,
        children: processedChildren,
        disabled: handler.isDisabled?.(editor, config) || !handler.canExecute(editor, config),
        active: handler.isActive(editor, config),
        onSelect: () => handler.execute(editor, config).run()
      }
    }

    // Pass through items without kind but with children
    return { ...rest, children: processedChildren }
  })
}

export function buildFloatingUIMiddleware(options: FloatingUIOptions): Middleware[] {
  const middleware: Middleware[] = []

  if (options.flip) {
    middleware.push(flip(typeof options.flip !== 'boolean' ? options.flip : undefined))
  }

  if (options.shift) {
    middleware.push(shift(typeof options.shift !== 'boolean' ? options.shift : undefined))
  }

  if (options.offset) {
    middleware.push(offset(typeof options.offset !== 'boolean' ? options.offset : undefined))
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
