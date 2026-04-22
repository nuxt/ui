import type { Ref, ComputedRef, MaybeRef } from 'vue';
import type { Editor } from '@tiptap/vue-3';
import type { SuggestionOptions } from '@tiptap/suggestion';
import type { FloatingUIOptions } from '../types/editor';
export interface EditorMenuOptions<T = any> {
    editor: Editor;
    /**
     * The trigger character (e.g., '/', '@', ':')
     */
    char: string;
    /**
     * Plugin key to identify this menu
     */
    pluginKey: string;
    /**
     * The items to display (can be a flat array or grouped)
     */
    items?: MaybeRef<T[] | T[][] | undefined>;
    /**
     * Fields to filter items by.
     * @defaultValue ['label']
     */
    filterFields?: string[];
    /**
     * Function to filter items based on query
     */
    filter?: (items: T[], query: string) => T[];
    /**
     * Whether to ignore the default filtering.
     * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    /**
     * Maximum number of items to display
     * @defaultValue 42
     */
    limit?: number;
    /**
     * Ref to sync the current search term with
     */
    searchTerm?: Ref<string>;
    /**
     * Function to execute when an item is selected
     */
    onSelect: (editor: Editor, range: any, item: T) => void;
    /**
     * Function to render each menu item
     */
    renderItem: (item: T, ui: ComputedRef<any>) => any;
    /**
     * The options for positioning the menu. Those are passed to Floating UI and include options for the placement, offset, flip, shift, size, autoPlacement, hide, and inline middleware.
     * @defaultValue { strategy: 'absolute', placement: 'bottom-start', offset: 8, shift: { padding: 8 } }
     * @see https://floating-ui.com/docs/computePosition#options
     */
    options?: FloatingUIOptions;
    /**
     * Optional TipTap Suggestion matching options.
     */
    suggestion?: Omit<Partial<SuggestionOptions>, 'pluginKey' | 'editor' | 'char' | 'items' | 'command' | 'render'>;
    /**
     * The DOM element to append the menu to. Default is the editor's parent element.
     *
     * Sometimes the menu needs to be appended to a different DOM context due to accessibility, clipping, or z-index issues.
     *
     * @type {HTMLElement}
     * @default editor.view.dom.parentElement
     */
    appendTo?: HTMLElement | (() => HTMLElement);
    /**
     * UI styles computed ref
     */
    ui: ComputedRef<any>;
}
export declare function useEditorMenu<T = any>(options: EditorMenuOptions<T>): {
    plugin: import("@tiptap/pm/state").Plugin<any>;
    destroy: () => void;
    filteredItems: Ref<T[], T[]>;
    searchTerm: Ref<string, string>;
};
