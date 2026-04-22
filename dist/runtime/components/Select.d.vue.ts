import type { SelectRootProps, SelectRootEmits, SelectContentProps, SelectContentEmits, SelectArrowProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/select';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { AvatarProps, ChipProps, IconProps } from '../types';
import type { ModelModifiers, ApplyModifiers } from '../types/input';
import type { ButtonHTMLAttributes } from '../types/html';
import type { AcceptableValue, ArrayOrNested, GetItemKeys, GetModelValue, NestedItem, EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Select = ComponentConfig<typeof theme, AppConfig, 'select'>;
export type SelectValue = AcceptableValue;
export type SelectItem = SelectValue | {
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
    value?: SelectValue;
    disabled?: boolean;
    onSelect?: (e: Event) => void;
    class?: any;
    ui?: Pick<Select['slots'], 'label' | 'separator' | 'item' | 'itemLeadingIcon' | 'itemLeadingAvatarSize' | 'itemLeadingAvatar' | 'itemLeadingChipSize' | 'itemLeadingChip' | 'itemWrapper' | 'itemLabel' | 'itemDescription' | 'itemTrailing' | 'itemTrailingIcon'>;
    [key: string]: any;
};
type ExcludeItem = {
    type: 'label' | 'separator';
};
export interface SelectProps<T extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = 'value', M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> extends Omit<SelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
    id?: string;
    /** The placeholder text when the select is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Select['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Select['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Select['variants']['size'];
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
     * The content of the menu.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }
     */
    content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<SelectContentEmits>>;
    /**
     * Display an arrow alongside the menu.
     * `{ rounded: true }`{lang="ts-type"}
     * @defaultValue false
     */
    arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>;
    /**
     * Render the menu in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * When `items` is an array of objects, select the field to use as the value.
     * @defaultValue 'value'
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
    /** The value of the Select when initially rendered. Use when you do not need to control the state of the Select. */
    defaultValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>;
    /** The controlled value of the Select. Can be bind as `v-model`. */
    modelValue?: ApplyModifiers<GetModelValue<T, VK, M, ExcludeItem>, Mod>;
    modelModifiers?: Mod;
    /** Whether multiple options can be selected or not. */
    multiple?: M & boolean;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    class?: any;
    ui?: Select['slots'];
}
export interface SelectEmits<A extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined, M extends boolean, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>> extends Omit<SelectRootEmits, 'update:modelValue'> {
    'change': [event: Event];
    'blur': [event: FocusEvent];
    'focus': [event: FocusEvent];
    'update:modelValue': [value: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod>];
}
type SlotProps<T extends SelectItem> = (props: {
    item: T;
    index: number;
    ui: Select['ui'];
}) => VNode[];
export interface SelectSlots<A extends ArrayOrNested<SelectItem> = ArrayOrNested<SelectItem>, VK extends GetItemKeys<A> | undefined = undefined, M extends boolean = false, Mod extends Omit<ModelModifiers, 'lazy'> = Omit<ModelModifiers, 'lazy'>, T extends NestedItem<A> = NestedItem<A>> {
    'leading'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod>;
        open: boolean;
        ui: Select['ui'];
    }): VNode[];
    'default'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod>;
        open: boolean;
        ui: Select['ui'];
    }): VNode[];
    'trailing'?(props: {
        modelValue: ApplyModifiers<GetModelValue<A, VK, M, ExcludeItem>, Mod>;
        open: boolean;
        ui: Select['ui'];
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
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<SelectItem>, VK extends GetItemKeys<T> = "value", M extends boolean = false, Mod extends Omit<ModelModifiers, "lazy"> = Omit<ModelModifiers, "lazy">>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<SelectProps<T, VK, M, Mod> & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        "onUpdate:modelValue"?: ((value: Mod extends {
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
        } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        triggerRef: Readonly<import("vue").Ref<HTMLButtonElement, HTMLButtonElement>>;
        viewportRef: Readonly<import("vue").Ref<HTMLElement | null, HTMLElement | null>>;
    }>) => void;
    attrs: any;
    slots: SelectSlots<T, VK, M, Mod, NestedItem<T>>;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "update:open", value: boolean) => void) & ((evt: "update:modelValue", value: Mod extends {
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
    } ? GetModelValue<T, VK, M, ExcludeItem> | null : GetModelValue<T, VK, M, ExcludeItem>) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
