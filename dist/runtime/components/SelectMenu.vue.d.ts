import type { ComboboxRootProps, ComboboxRootEmits, ComboboxContentProps, ComboboxContentEmits, ComboboxArrowProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/select-menu';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ButtonProps, ChipProps, IconProps, InputProps, LinkPropsKeys } from '../types';
import type { ModelModifiers, ApplyModifiers } from '../types/input';
import type { ButtonHTMLAttributes } from '../types/html';
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetModelValue, NestedItem, EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type SelectMenu = ComponentConfig<typeof theme, AppConfig, 'selectMenu'>;
export type SelectMenuValue = AcceptableValue;
export type SelectMenuItem = SelectMenuValue | {
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
    ui?: Pick<SelectMenu['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
};
type ExcludeItem = {
    type: 'label' | 'separator';
};
type IsClearUsed<M extends boolean, C extends boolean | object> = M extends false ? (C extends true ? null : C extends object ? null : never) : never;
export interface SelectMenuProps<T extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, C extends boolean | object = false> extends Pick<ComboboxRootProps<T>, 'open' | 'defaultOpen' | 'disabled' | 'name' | 'resetSearchTermOnBlur' | 'resetSearchTermOnSelect' | 'resetModelValueOnClear' | 'highlightOnHover' | 'by'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
    id?: string;
    /** The placeholder text when the select is empty. */
    placeholder?: string;
    /**
     * Whether to display the search input or not.
     * Can be an object to pass additional props to the input.
     * `{ placeholder: 'Search...', variant: 'none' }`{lang="ts-type"}
     * @defaultValue true
     */
    searchInput?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>;
    /**
     * @defaultValue 'primary'
     */
    color?: SelectMenu['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: SelectMenu['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: SelectMenu['variants']['size'];
    required?: boolean;
    /**
     * The icon displayed to open the menu.
     * @defaultValue appConfig.ui.icons.chevronDown
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
     * Display a clear button to reset the model value.
     * Can be an object to pass additional props to the Button.
     * @defaultValue false
     */
    clear?: (C & boolean) | (C & Partial<Omit<ButtonProps, LinkPropsKeys>>);
    /**
     * The icon displayed in the clear button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    clearIcon?: IconProps['name'];
    /**
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
     */
    content?: Omit<ComboboxContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<ComboboxContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * `{ rounded: true }`{lang="ts-type"}
     * @defaultValue false
     */
    arrow?: boolean | Omit<ComboboxArrowProps, 'as' | 'asChild'>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
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
    valueKey?: VK;
    /**
     * When `items` is an array of objects, select the field to use as the label.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    /**
     * When `items` is an array of objects, select the field to use as the description.
     * @defaultValue 'description'
     */
    descriptionKey?: GetItemKeys<T>;
    items?: T;
    /** The value of the SelectMenu when initially rendered. Use when you do not need to control the state of the SelectMenu. */
    defaultValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
    /** The controlled value of the SelectMenu. Can be binded-with with `v-model`. */
    modelValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
    modelModifiers?: Mod;
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /**
     * Determines if custom user input that does not exist in options can be added.
     * @defaultValue false
     */
    createItem?: boolean | 'always' | {
        position?: 'top' | 'bottom';
        when?: 'empty' | 'always';
    };
    /**
     * Fields to filter items by.
     * @defaultValue [labelKey]
     */
    filterFields?: string[];
    /**
     * When `true`, disable the default filters, useful for custom filtering (useAsyncData, useFetch, etc.).
     * @defaultValue false
     */
    ignoreFilter?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    class?: any;
    ui?: SelectMenu['slots'];
}
export interface SelectMenuEmits<A extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined, M extends boolean, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, C extends boolean | object = false> extends Pick<ComboboxRootEmits, 'update:open'> {
    'change': [event: Event];
    'blur': [event: FocusEvent];
    'focus': [event: FocusEvent];
    'create': [item: string];
    'clear': [];
    /** Event handler when highlighted element changes. */
    'highlight': [
        payload: {
            ref: HTMLElement;
            value: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
        } | undefined
    ];
    'update:modelValue': [value: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>];
}
type SlotProps<T extends SelectMenuItem> = (props: {
    item: T;
    index: number;
    ui: SelectMenu['ui'];
}) => VNode[];
export interface SelectMenuSlots<A extends ArrayOrNested<SelectMenuItem> = ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<A> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, C extends boolean | object = false, T extends NestedItem<A> = NestedItem<A>> {
    'leading'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
        open: boolean;
        ui: SelectMenu['ui'];
    }): VNode[];
    'default'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
        open: boolean;
        ui: SelectMenu['ui'];
    }): VNode[];
    'trailing'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod> | IsClearUsed<M, C>;
        open: boolean;
        ui: SelectMenu['ui'];
    }): VNode[];
    'empty'?(props: {
        searchTerm: string;
    }): VNode[];
    'item'?: SlotProps<T>;
    'item-leading'?: SlotProps<T>;
    'item-label'?(props: {
        item: T;
        index: number;
    }): VNode[];
    'item-description'?(props: {
        item: T;
        index: number;
    }): VNode[];
    'item-trailing'?: SlotProps<T>;
    'content-top'?: (props?: {}) => VNode[];
    'content-bottom'?: (props?: {}) => VNode[];
    'create-item-label'?(props: {
        item: string;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<SelectMenuItem>, VK extends GetItemKeys<T> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, "lazy"> = Omit<ModelModifiers, "lazy">, C extends boolean | object = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(SelectMenuProps<T, VK, M, Mod, C> & {
        searchTerm?: string;
    }) & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onClear?: (() => any) | undefined;
        onCreate?: ((item: string) => any) | undefined;
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((value: (Mod extends {
            number: true;
        } ? (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) extends infer T_1 ? T_1 extends (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | IsClearUsed<M, C>) => any) | undefined;
        onHighlight?: ((payload: {
            ref: HTMLElement;
            value: (Mod extends {
                number: true;
            } ? (Mod extends {
                optional: true;
            } ? (Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) extends infer T_1 ? T_1 extends (Mod extends {
                optional: true;
            } ? (Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
                optional: true;
            } ? (Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
                nullable: true;
            } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | IsClearUsed<M, C>;
        } | undefined) => any) | undefined;
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        triggerRef: Readonly<import("vue").Ref<HTMLButtonElement, HTMLButtonElement>>;
        viewportRef: Readonly<import("vue").Ref<HTMLDivElement | null, HTMLDivElement | null>>;
    }>) => void;
    attrs: any;
    slots: SelectMenuSlots<T, VK, M, Mod, C, NestedItem<T>>;
    emit: (((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "clear") => void) & ((evt: "create", item: string) => void) & ((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", value: (Mod extends {
        number: true;
    } ? (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) extends infer T_1 ? T_1 extends (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
        nullable: true;
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | IsClearUsed<M, C>) => void) & ((evt: "highlight", payload: {
        ref: HTMLElement;
        value: (Mod extends {
            number: true;
        } ? (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) extends infer T_1 ? T_1 extends (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | undefined : Mod extends {
            nullable: true;
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) | IsClearUsed<M, C>;
    } | undefined) => void)) & ((event: "update:searchTerm", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
