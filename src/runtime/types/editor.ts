import type { Editor } from '@tiptap/vue-3'
import type { Strategy, Placement, OffsetOptions, FlipOptions, ShiftOptions, SizeOptions, AutoPlacementOptions, HideOptions, InlineOptions } from '@floating-ui/dom'

export type { Editor } from '@tiptap/vue-3'

export interface FloatingUIOptions {
  strategy?: Strategy
  placement?: Placement
  offset?: OffsetOptions | boolean
  flip?: FlipOptions | boolean
  shift?: ShiftOptions | boolean
  size?: SizeOptions | boolean
  autoPlacement?: AutoPlacementOptions | boolean
  hide?: HideOptions | boolean
  inline?: InlineOptions | boolean
}

export type EditorHandlers = Partial<Record<EditorItem['kind'], EditorHandler>>

export interface EditorHandler {
  canExecute: (editor: Editor, cmd?: any) => boolean
  execute: (editor: Editor, cmd?: any) => any
  isActive: (editor: Editor, cmd?: any) => boolean
  isDisabled?: (editor: Editor, cmd?: any) => boolean
}

export type EditorItem
  = | { kind: 'mark', mark: 'bold' | 'italic' | 'strike' | 'code' | 'underline' }
    | { kind: 'textAlign', align: 'left' | 'center' | 'right' | 'justify' }
    | { kind: 'heading', level: 1 | 2 | 3 | 4 | 5 | 6 }
    | { kind: 'link', href?: string }
    | { kind: 'image', src?: string }
    | { kind: 'blockquote' | 'bulletList' | 'orderedList' | 'codeBlock' | 'horizontalRule' | 'paragraph' | 'undo' | 'redo' | 'mention' | 'emoji' }
