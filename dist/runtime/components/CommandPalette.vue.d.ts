import type { ListboxRootProps, ListboxRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import theme from '#build/ui/command-palette';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ButtonProps, ChipProps, KbdProps, InputProps, LinkProps, IconProps, LinkPropsKeys } from '../types';
import type { GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type CommandPalette = ComponentConfig<typeof theme, AppConfig, 'commandPalette'>;
export interface CommandPaletteItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
    prefix?: string;
    label?: string;
    suffix?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    chip?: ChipProps;
    kbds?: KbdProps['value'][] | KbdProps[];
    active?: boolean;
    loading?: boolean;
    disabled?: boolean;
    slot?: string;
    /**
     * The placeholder to display when the item has children.
     */
    placeholder?: string;
    children?: CommandPaletteItem[];
    onSelect?: (e: Event) => void;
    class?: any;
    ui?: Pick<CommandPalette['slots'], 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemLabelPrefix' | 'itemLabelBase' | 'itemLabelSuffix' | 'itemTrailing' | 'itemTrailingKbds' | 'itemTrailingKbdsSize' | 'itemTrailingHighlightedIcon' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export interface CommandPaletteGroup<T extends CommandPaletteItem = CommandPaletteItem> {
    id: string;
    label?: string;
    slot?: string;
    items?: T[];
    /**
     * Whether to filter group items with [useFuse](https://vueuse.org/integrations/useFuse).
     * When `true`, items will not be filtered which is useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    /** Filter group items after the search happened. */
    postFilter?: (searchTerm: string, items: T[]) => T[];
    /**
     * The icon displayed when an item is highlighted.
     * @IconifyIcon
     */
    highlightedIcon?: IconProps['name'];
}
export interface CommandPaletteProps<G extends CommandPaletteGroup<T> = CommandPaletteGroup<any>, T extends CommandPaletteItem = CommandPaletteItem> extends Pick<ListboxRootProps, 'multiple' | 'disabled' | 'modelValue' | 'defaultValue' | 'highlightOnHover' | 'selectionBehavior' | 'by'>, Pick<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: CommandPalette['variants']['size'];
    /**
     * The icon displayed in the input.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The icon displayed on the right side of the input.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The icon displayed when an item is selected.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    selectedIcon?: IconProps['name'];
    /**
     * The icon displayed when an item has children.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    childrenIcon?: IconProps['name'];
    /**
     * The placeholder text for the input.
     * @defaultValue t('commandPalette.placeholder')
     */
    placeholder?: InputProps['placeholder'];
    /**
     * Automatically focus the input when component is mounted.
     * @defaultValue true
     */
    autofocus?: boolean;
    /**
     * Display a close button in the input (useful when inside a Modal for example).
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @emits 'update:open'
     * @defaultValue false
     */
    close?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: IconProps['name'];
    /**
     * Display a button to navigate back in history.
     * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
     * @defaultValue true
     */
    back?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the back button.
     * @defaultValue appConfig.ui.icons.arrowLeft
     * @IconifyIcon
     */
    backIcon?: IconProps['name'];
    /**
     * Configure the input or hide it with `false`.
     * @defaultValue true
     */
    input?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>;
    groups?: G[];
    /**
     * Options for [useFuse](https://vueuse.org/integrations/useFuse).
     * @defaultValue {
        fuseOptions: {
          ignoreLocation: true,
          threshold: 0.1,
          keys: ['label', 'description', 'suffix']
        },
        resultLimit: 12,
        matchAllWhenSearchEmpty: true
      }
     */
    fuse?: UseFuseOptions<T>;
    /**
     * Enable virtualization for large lists.
     * Note: when enabled, all groups are flattened into a single list due to a limitation of Reka UI (https://github.com/unovue/reka-ui/issues/1885).
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
    /**
     * When `items` is an array of objects, select the field to use as the value instead of the object itself.
     * @defaultValue undefined
     */
    valueKey?: GetItemKeys<T>;
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
     * Whether to preserve the order of groups as defined in the `groups` prop when filtering.
     * When `false`, groups will appear based on item matches.
     * @defaultValue false
     */
    preserveGroupOrder?: boolean;
    /**
     * Delay (in milliseconds) before the search term is passed to Fuse (debounced).
     * Useful when indexing large datasets where fuzzy search becomes the bottleneck — the input stays responsive while Fuse and the result pipeline only re-run after typing settles.
     * Set to `0` (the default) to disable.
     * @defaultValue 0
     */
    searchDelay?: number;
    class?: any;
    ui?: CommandPalette['slots'];
}
export type CommandPaletteEmits<T extends CommandPaletteItem = CommandPaletteItem> = ListboxRootEmits<T> & {
    'update:open': [value: boolean];
};
type SlotProps<T> = (props: {
    item: T;
    index: number;
    ui: CommandPalette['ui'];
}) => VNode[];
type GroupSlotProps<T extends CommandPaletteItem = CommandPaletteItem, G extends CommandPaletteGroup<T> = CommandPaletteGroup<T>> = (props: {
    group: G;
    label: string;
    ui: CommandPalette['ui'];
}) => VNode[];
type GroupSlots<T extends CommandPaletteItem = CommandPaletteItem, G extends CommandPaletteGroup<T> = CommandPaletteGroup<T>> = {
    'group-label'?: GroupSlotProps<T, G>;
} & Record<`${string}-group-label`, GroupSlotProps<T, G>>;
export type CommandPaletteSlots<T extends CommandPaletteItem = CommandPaletteItem, G extends CommandPaletteGroup<T> = CommandPaletteGroup<T>> = {
    'empty'?(props: {
        searchTerm: string;
    }): VNode[];
    'footer'?(props: {
        ui: CommandPalette['ui'];
    }): VNode[];
    'back'?(props: {
        ui: CommandPalette['ui'];
    }): VNode[];
    'close'?(props: {
        ui: CommandPalette['ui'];
    }): VNode[];
    'item'?: SlotProps<T>;
    'item-leading'?: SlotProps<T>;
    'item-label'?: SlotProps<T>;
    'item-description'?: SlotProps<T>;
    'item-trailing'?: SlotProps<T>;
} & Record<string, SlotProps<T>> & GroupSlots<T, G>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <G extends CommandPaletteGroup<T>, T extends CommandPaletteItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(CommandPaletteProps<G, T> & {
        searchTerm?: string;
    }) & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((value: T) => any) | undefined;
        onHighlight?: ((payload: {
            ref: HTMLElement;
            value: T;
        } | undefined) => any) | undefined;
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
        onEntryFocus?: ((event: CustomEvent<any>) => any) | undefined;
        onLeave?: ((event: Event) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: CommandPaletteSlots<T, G>;
    emit: (((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", value: T) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: T;
    } | undefined) => void) & ((evt: "entryFocus", event: CustomEvent<any>) => void) & ((evt: "leave", event: Event) => void)) & ((event: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
