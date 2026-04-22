import type { ContextMenuRootProps, ContextMenuRootEmits, ContextMenuContentProps, ContextMenuContentEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/context-menu';
import type { AvatarProps, IconProps, KbdProps, LinkProps } from '../types';
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>;
export interface ContextMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    label?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    color?: ContextMenu['variants']['color'];
    avatar?: AvatarProps;
    content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & {
        class?: any;
    } & Partial<EmitsToProps<ContextMenuContentEmits>>;
    kbds?: KbdProps['value'][] | KbdProps[];
    /**
     * The item type.
     * @defaultValue 'link'
     */
    type?: 'label' | 'separator' | 'link' | 'checkbox';
    slot?: string;
    loading?: boolean;
    disabled?: boolean;
    checked?: boolean;
    open?: boolean;
    defaultOpen?: boolean;
    children?: ArrayOrNested<ContextMenuItem>;
    onSelect?: (e: Event) => void;
    onUpdateChecked?: (checked: boolean) => void;
    class?: any;
    ui?: Pick<ContextMenu['slots'], 'content' | 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds' | 'itemTrailingKbdsSize'>;
    [key: string]: any;
}
export interface ContextMenuProps<T extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>> extends Omit<ContextMenuRootProps, 'dir'> {
    /**
     * @defaultValue 'md'
     */
    size?: ContextMenu['variants']['size'];
    items?: T;
    /**
     * The icon displayed when an item is checked.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    checkedIcon?: IconProps['name'];
    /**
     * The icon displayed when an item is loading.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * The icon displayed when the item is an external link.
     * Set to `false` to hide the external icon.
     * @defaultValue appConfig.ui.icons.external
     * @IconifyIcon
     */
    externalIcon?: boolean | IconProps['name'];
    /** The content of the menu. */
    content?: Omit<ContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ContextMenuContentEmits>>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    /**
     * The key used to get the description from the item.
     * @defaultValue 'description'
     */
    descriptionKey?: GetItemKeys<T>;
    disabled?: boolean;
    class?: any;
    ui?: ContextMenu['slots'];
}
export interface ContextMenuEmits extends ContextMenuRootEmits {
}
type SlotProps<T extends ContextMenuItem> = (props: {
    item: T;
    active: boolean;
    index: number;
    ui: ContextMenu['ui'];
}) => VNode[];
export type ContextMenuSlots<A extends ArrayOrNested<ContextMenuItem> = ArrayOrNested<ContextMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'default'?(props?: {}): VNode[];
    'item'?: SlotProps<T>;
    'item-leading'?: SlotProps<T>;
    'item-label'?: (props: {
        item: T;
        active: boolean;
        index: number;
    }) => VNode[];
    'item-description'?: (props: {
        item: T;
        active: boolean;
        index: number;
    }) => VNode[];
    'item-trailing'?: SlotProps<T>;
    'content-top'?: (props: {
        sub: boolean;
    }) => VNode[];
    'content-bottom'?: (props: {
        sub: boolean;
    }) => VNode[];
} & DynamicSlots<MergeTypes<T>, 'label' | 'description', {
    active: boolean;
    index: number;
}> & DynamicSlots<MergeTypes<T>, 'leading' | 'trailing', {
    active: boolean;
    index: number;
    ui: ContextMenu['ui'];
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<ContextMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ContextMenuProps<T> & {
        "onUpdate:open"?: ((payload: boolean) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContextMenuSlots<T, NestedItem<T>>;
    emit: (evt: "update:open", payload: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
