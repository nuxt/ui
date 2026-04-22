import type { VNode } from 'vue';
import type { TreeRootProps, TreeRootEmits, TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/tree';
import type { IconProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Tree = ComponentConfig<typeof theme, AppConfig, 'tree'>;
export type TreeItem = {
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    label?: string;
    /**
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    defaultExpanded?: boolean;
    disabled?: boolean;
    slot?: string;
    children?: TreeItem[];
    onToggle?: (e: TreeItemToggleEvent<TreeItem>) => void;
    onSelect?: (e: TreeItemSelectEvent<TreeItem>) => void;
    class?: any;
    ui?: Pick<Tree['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkLeadingIcon' | 'linkLabel' | 'linkTrailing' | 'linkTrailingIcon' | 'listWithChildren'>;
    [key: string]: any;
};
export interface TreeProps<T extends TreeItem[] = TreeItem[], M extends boolean = false> extends Pick<TreeRootProps<T>, 'expanded' | 'defaultExpanded' | 'selectionBehavior' | 'propagateSelect' | 'disabled' | 'bubbleSelect'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'ul'
     */
    as?: any | {
        root?: any;
        link?: any;
    };
    /**
     * @defaultValue 'primary'
     */
    color?: Tree['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Tree['variants']['size'];
    /** This function is passed the index of each item and should return a unique key for that item */
    getKey?: (val: T[number]) => string;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    /**
     * The icon displayed on the right side of a parent node.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The icon displayed when a parent node is expanded.
     * @defaultValue appConfig.ui.icons.folderOpen
     * @IconifyIcon
     */
    expandedIcon?: IconProps['name'];
    /**
     * The icon displayed when a parent node is collapsed.
     * @defaultValue appConfig.ui.icons.folder
     * @IconifyIcon
     */
    collapsedIcon?: IconProps['name'];
    items?: T;
    /** The controlled value of the Tree. Can be bind as `v-model`. */
    modelValue?: M extends true ? T[number][] : T[number];
    /** The value of the Tree when initially rendered. Use when you do not need to control the state of the Tree. */
    defaultValue?: M extends true ? T[number][] : T[number];
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    /**
     * Use nested DOM structure (children inside parents) vs flattened structure (all items at same level).
     * When `virtualize` is enabled, this is automatically set to `false`.
     * @defaultValue true
     */
    nested?: boolean;
    /**
     * Enable virtualization for large lists.
     * Note: when enabled, the tree structure is flattened like if `nested` was set to `false`.
     * @defaultValue false
     */
    virtualize?: boolean | {
        /**
         * Number of items rendered outside the visible area
         * @defaultValue 12
         */
        overscan?: number;
        /**
         * Estimated size (in px) of each item, or a function that returns the size for a given index
         * @defaultValue 32
         */
        estimateSize?: number | ((index: number) => number);
    };
    onSelect?: (e: TreeItemSelectEvent<T[number]>, item: T[number]) => void;
    onToggle?: (e: TreeItemToggleEvent<T[number]>, item: T[number]) => void;
    class?: any;
    ui?: Tree['slots'];
}
export type TreeEmits<T extends TreeItem[] = TreeItem[], M extends boolean = false> = TreeRootEmits<T[number], M>;
type SlotProps<T extends TreeItem> = (props: {
    item: T;
    index: number;
    level: number;
    expanded: boolean;
    selected: boolean;
    indeterminate: boolean | undefined;
    handleSelect: () => void;
    handleToggle: () => void;
    ui: Tree['ui'];
}) => VNode[];
export type TreeSlots<T extends TreeItem[] = TreeItem[]> = {
    'item-wrapper'?: SlotProps<T[number]>;
    'item'?: SlotProps<T[number]>;
    'item-leading'?: SlotProps<T[number]>;
    'item-label'?: SlotProps<T[number]>;
    'item-trailing'?: SlotProps<T[number]>;
} & DynamicSlots<T[number], undefined, {
    index: number;
    level: number;
    expanded: boolean;
    ui: Tree['ui'];
    selected: boolean;
    indeterminate: boolean | undefined;
    handleSelect: () => void;
    handleToggle: () => void;
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends TreeItem[], M extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<TreeProps<T, M> & {
        "onUpdate:modelValue"?: ((val: M extends true ? T[number][] : T[number]) => any) | undefined;
        "onUpdate:expanded"?: ((val: string[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        readonly $el: HTMLElement;
    }>) => void;
    attrs: any;
    slots: TreeSlots<T>;
    emit: ((evt: "update:modelValue", val: M extends true ? T[number][] : T[number]) => void) & ((evt: "update:expanded", val: string[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
