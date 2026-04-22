import type { DropdownMenuRootProps, DropdownMenuRootEmits, DropdownMenuContentProps, DropdownMenuContentEmits, DropdownMenuArrowProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dropdown-menu';
import type { AvatarProps, IconProps, InputProps, KbdProps, LinkProps } from '../types';
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>;
export interface DropdownMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    label?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    color?: DropdownMenu['variants']['color'];
    avatar?: AvatarProps;
    content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & {
        class?: any;
    } & Partial<EmitsToProps<DropdownMenuContentEmits>>;
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
    filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>;
    filterFields?: string[];
    ignoreFilter?: boolean;
    children?: ArrayOrNested<DropdownMenuItem>;
    onSelect?: (e: Event) => void;
    onUpdateChecked?: (checked: boolean) => void;
    class?: any;
    ui?: Pick<DropdownMenu['slots'], 'content' | 'item' | 'label' | 'separator' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelExternalIcon' | 'itemTrailing' | 'itemTrailingIcon' | 'itemTrailingKbds' | 'itemTrailingKbdsSize'>;
    [key: string]: any;
}
export interface DropdownMenuProps<T extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>> extends Omit<DropdownMenuRootProps, 'dir'> {
    /**
     * @defaultValue 'md'
     */
    size?: DropdownMenu['variants']['size'];
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
    /**
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
     */
    content?: Omit<DropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DropdownMenuContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * `{ rounded: true }`{lang="ts-type"}
     * @defaultValue false
     */
    arrow?: boolean | Omit<DropdownMenuArrowProps, 'as' | 'asChild'>;
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
    /**
     * Whether to display a filter input or not.
     * Can be an object to pass additional props to the input.
     * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
     * @defaultValue false
     */
    filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>;
    /**
     * The fields to filter by.
     * @defaultValue [labelKey]
     */
    filterFields?: string[];
    /**
     * When `true`, items will not be filtered which is useful for custom filtering.
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    disabled?: boolean;
    class?: any;
    ui?: DropdownMenu['slots'];
}
export interface DropdownMenuEmits extends DropdownMenuRootEmits {
}
type SlotProps<T extends DropdownMenuItem> = (props: {
    item: T;
    active: boolean;
    index: number;
    ui: DropdownMenu['ui'];
}) => VNode[];
export type DropdownMenuSlots<A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'default'?(props: {
        open: boolean;
    }): VNode[];
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
    'empty'?(props: {
        searchTerm: string;
    }): VNode[];
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
    ui: DropdownMenu['ui'];
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<DropdownMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(DropdownMenuProps<T> & {
        searchTerm?: string;
    }) & {
        "onUpdate:open"?: ((payload: boolean) => any) | undefined;
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: DropdownMenuSlots<T, NestedItem<T>>;
    emit: ((evt: "update:open", payload: boolean) => void) & ((event: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
