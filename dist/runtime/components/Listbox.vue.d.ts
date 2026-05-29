import type { VNode } from 'vue';
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/listbox';
import type { AvatarProps, ChipProps, IconProps, InputProps } from '../types';
import type { ModelModifiers, ApplyModifiers } from '../types/input';
import type { ArrayOrNested, GetItemKeys, GetModelValue, NestedItem } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Listbox = ComponentConfig<typeof theme, AppConfig, 'listbox'>;
export interface ListboxItem {
    label?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    chip?: ChipProps;
    /**
     * The item type.
     * @defaultValue 'item'
     */
    type?: 'label' | 'separator' | 'item';
    disabled?: boolean;
    onSelect?: (e: Event) => void;
    class?: any;
    ui?: Pick<Listbox['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatar' | 'itemLeadingAvatarSize' | 'itemLeadingChip' | 'itemLeadingChipSize' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
}
export interface ListboxProps<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> extends Pick<ListboxRootProps, 'by' | 'disabled' | 'highlightOnHover' | 'name' | 'orientation' | 'required' | 'selectionBehavior'> {
    id?: string;
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: Listbox['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Listbox['variants']['size'];
    /**
     * The items to display in the list.
     */
    items?: T;
    /**
     * The controlled value of the Listbox. Can be bound with `v-model`.
     */
    modelValue?: ApplyModifiers<GetModelValue<T, VK, M>, Mod>;
    modelModifiers?: Mod;
    /**
     * The default value when not controlled.
     */
    defaultValue?: ApplyModifiers<GetModelValue<T, VK, M>, Mod>;
    /**
     * Whether multiple items can be selected.
     * @defaultValue false
     */
    multiple?: M & boolean;
    /**
     * When `items` is an array of objects, select the field to use as the value instead of the object itself.
     * @defaultValue undefined
     */
    valueKey?: VK;
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
     * Whether the list is in a loading state.
     */
    loading?: boolean;
    /**
     * The icon displayed when loading.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
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
     * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    /**
     * The icon displayed when an item is selected.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    selectedIcon?: IconProps['name'];
    /**
     * Enable virtualization for large lists.
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
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    class?: any;
    ui?: Listbox['slots'];
}
export type ListboxEmits<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> = Pick<ListboxRootEmits, 'entryFocus' | 'highlight' | 'leave'> & {
    'change': [event: Event];
    'update:modelValue': [value: ApplyModifiers<GetModelValue<T, VK, M>, Mod>];
};
type SlotProps<T> = (props: {
    item: T;
    index: number;
    ui: Listbox['ui'];
}) => VNode[];
export type ListboxSlots<T extends ArrayOrNested<ListboxItem> = ArrayOrNested<ListboxItem>> = {
    'loading'?(props?: {}): VNode[];
    'empty'?(props: {
        searchTerm: string;
    }): VNode[];
    'item'?: SlotProps<NestedItem<T>>;
    'item-leading'?: SlotProps<NestedItem<T>>;
    'item-label'?(props: {
        item: NestedItem<T>;
        index: number;
    }): VNode[];
    'item-description'?(props: {
        item: NestedItem<T>;
        index: number;
    }): VNode[];
    'item-trailing'?: SlotProps<NestedItem<T>>;
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<ListboxItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, "lazy"> = Omit<ModelModifiers, "lazy">>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(ListboxProps<T, VK, M, Mod> & {
        searchTerm?: string;
    }) & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: Mod extends {
            number: true;
        } ? (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) extends infer T_1 ? T_1 extends (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) => any) | undefined;
        onHighlight?: ((payload: {
            ref: HTMLElement;
            value: import("reka-ui").AcceptableValue;
        } | undefined) => any) | undefined;
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
        onEntryFocus?: ((event: CustomEvent<any>) => any) | undefined;
        onLeave?: ((event: Event) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ListboxSlots<T>;
    emit: (((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: Mod extends {
        number: true;
    } ? (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) extends infer T_1 ? T_1 extends (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, undefined> | null : GetModelValue<T, VK, M, undefined>) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: import("reka-ui").AcceptableValue;
    } | undefined) => void) & ((evt: "entryFocus", event: CustomEvent<any>) => void) & ((evt: "leave", event: Event) => void)) & ((event: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
