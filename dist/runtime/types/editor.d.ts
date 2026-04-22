import type { Editor } from '@tiptap/vue-3';
import type { Strategy, Placement, OffsetOptions, FlipOptions, ShiftOptions, SizeOptions, AutoPlacementOptions, HideOptions, InlineOptions } from '@floating-ui/dom';
export interface FloatingUIOptions {
    strategy?: Strategy;
    placement?: Placement;
    offset?: OffsetOptions | boolean;
    flip?: FlipOptions | boolean;
    shift?: ShiftOptions | boolean;
    size?: SizeOptions | boolean;
    autoPlacement?: AutoPlacementOptions | boolean;
    hide?: HideOptions | boolean;
    inline?: InlineOptions | boolean;
}
export interface EditorHandler {
    canExecute: (editor: Editor, cmd?: any) => boolean;
    execute: (editor: Editor, cmd?: any) => any;
    isActive: (editor: Editor, cmd?: any) => boolean;
    isDisabled?: (editor: Editor, cmd?: any) => boolean;
}
export type EditorCustomHandlers = Record<string, EditorHandler>;
export type EditorHandlers<H extends EditorCustomHandlers = EditorCustomHandlers> = {
    mark: EditorHandler;
    textAlign: EditorHandler;
    heading: EditorHandler;
    link: EditorHandler;
    image: EditorHandler;
    blockquote: EditorHandler;
    bulletList: EditorHandler;
    orderedList: EditorHandler;
    taskList: EditorHandler;
    codeBlock: EditorHandler;
    horizontalRule: EditorHandler;
    paragraph: EditorHandler;
    undo: EditorHandler;
    redo: EditorHandler;
    clearFormatting: EditorHandler;
    duplicate: EditorHandler;
    delete: EditorHandler;
    moveUp: EditorHandler;
    moveDown: EditorHandler;
    suggestion: EditorHandler;
    mention: EditorHandler;
    emoji: EditorHandler;
} & H;
export type EditorItem<H extends EditorCustomHandlers = EditorCustomHandlers> = {
    kind: 'mark';
    mark: 'bold' | 'italic' | 'strike' | 'code' | 'underline';
} | {
    kind: 'textAlign';
    align: 'left' | 'center' | 'right' | 'justify';
} | {
    kind: 'heading';
    level: 1 | 2 | 3 | 4 | 5 | 6;
} | {
    kind: 'link';
    href?: string;
} | {
    kind: 'image';
    src?: string;
} | {
    kind: 'duplicate' | 'delete' | 'moveUp' | 'moveDown';
    pos: number;
} | {
    kind: 'clearFormatting' | 'suggestion';
    pos?: number;
} | {
    kind: 'blockquote' | 'bulletList' | 'orderedList' | 'taskList' | 'codeBlock' | 'horizontalRule' | 'paragraph' | 'undo' | 'redo' | 'mention' | 'emoji';
} | {
    kind: keyof H;
};
