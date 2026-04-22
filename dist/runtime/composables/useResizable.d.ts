import type { Ref } from 'vue';
export type UseResizableProps = {
    /**
     * The id of the panel.
     * @defaultValue useId()
     */
    id?: string;
    /**
     * The side to render the panel on.
     * @defaultValue 'left'
     */
    side?: 'left' | 'right';
    /**
     * The minimum size of the panel.
     * @defaultValue 0
     */
    minSize?: number;
    /**
     * The maximum size of the panel.
     * @defaultValue 100
     */
    maxSize?: number;
    /**
     * The default size of the panel.
     * @defaultValue 0
     */
    defaultSize?: number;
    /**
     * Whether to allow the user to resize the panel.
     * @defaultValue true
     */
    resizable?: boolean;
    /**
     * Whether to allow the user to collapse the panel.
     * @defaultValue true
     */
    collapsible?: boolean;
    /**
     * The size of the panel when collapsed.
     * @defaultValue 0
     */
    collapsedSize?: number;
    /**
     * The storage to use for the size.
     * @defaultValue 'cookie'
     */
    storage?: 'cookie' | 'local';
    /**
     * Unique id used to auto-save size.
     * @defaultValue 'dashboard'
     */
    storageKey?: string;
    /**
     * Whether to persist the size in the storage.
     * @defaultValue true
     */
    persistent?: boolean;
    /**
     * The unit to use for size values.
     * @defaultValue '%'
     */
    unit?: '%' | 'rem' | 'px';
};
export type UseResizableReturn = {
    el: Ref<HTMLElement | null>;
    size: Ref<number>;
    isDragging: Ref<boolean>;
    isCollapsed: Ref<boolean>;
    onMouseDown: (e: MouseEvent) => void;
    onTouchStart: (e: TouchEvent) => void;
    onDoubleClick: (e: MouseEvent) => void;
    collapse: (value?: boolean) => void;
};
export declare function useResizable(key: string, options?: Ref<UseResizableProps> | UseResizableProps, { collapsed }?: {
    collapsed?: Ref<boolean>;
}): UseResizableReturn;
