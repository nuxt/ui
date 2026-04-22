import type { Editor, Mark } from '@tiptap/vue-3';
import type { Middleware } from '@floating-ui/dom';
import type { EditorHandlers, EditorCustomHandlers, EditorItem, FloatingUIOptions } from '../types/editor';
export declare function isMarkInSchema(mark: string | Mark, editor: Editor | null): boolean;
export declare function isNodeTypeSelected(editor: Editor | null, nodeTypes: string[]): boolean;
export declare function isExtensionAvailable(editor: Editor | null, extensionName: string): boolean;
export declare function createToggleHandler(name: string): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor) => any;
    isActive: (editor: Editor) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createSetHandler(name: string): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor) => any;
    isActive: (editor: Editor) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createSimpleHandler(name: string): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor) => any;
    isActive: () => boolean;
    isDisabled: undefined;
};
export declare function createMarkHandler(): {
    canExecute: (editor: Editor, cmd: any) => any;
    execute: (editor: Editor, cmd: any) => import("@tiptap/core").ChainedCommands;
    isActive: (editor: Editor, cmd: any) => boolean;
    isDisabled: (editor: Editor, cmd: any) => boolean;
};
export declare function createTextAlignHandler(): {
    canExecute: (editor: Editor, cmd: any) => any;
    execute: (editor: Editor, cmd: any) => any;
    isActive: (editor: Editor, cmd: any) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createHeadingHandler(): {
    canExecute: (editor: Editor, cmd: any) => any;
    execute: (editor: Editor, cmd: any) => import("@tiptap/core").ChainedCommands;
    isActive: (editor: Editor, cmd: any) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createLinkHandler(): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor, cmd: any) => import("@tiptap/core").ChainedCommands;
    isActive: (editor: Editor) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createImageHandler(): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor, cmd: any) => import("@tiptap/core").ChainedCommands;
    isActive: (editor: Editor) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createListHandler(listType: 'bulletList' | 'orderedList' | 'taskList'): {
    canExecute: (editor: Editor) => any;
    execute: (editor: Editor) => any;
    isActive: (editor: Editor) => boolean;
    isDisabled: (editor: Editor) => boolean;
};
export declare function createMoveHandler(direction: 'up' | 'down'): {
    canExecute: (editor: Editor, cmd: any) => boolean;
    execute: (editor: Editor, cmd: any) => import("@tiptap/core").ChainedCommands;
    isActive: () => boolean;
    isDisabled: undefined;
};
export declare function createHandlers(): EditorHandlers;
export declare function mapEditorItems(editor: Editor, items: (Partial<EditorItem> & Record<string, any>)[] | (Partial<EditorItem> & Record<string, any>)[][], customHandlers?: EditorCustomHandlers): any[] | any[][];
export declare function buildFloatingUIMiddleware(options: FloatingUIOptions): Middleware[];
