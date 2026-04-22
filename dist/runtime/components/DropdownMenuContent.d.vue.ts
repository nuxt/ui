import { DropdownMenu } from 'reka-ui/namespaced';
import type { DropdownMenuContentProps as RekaDropdownMenuContentProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type theme from '#build/ui/dropdown-menu';
import type { DropdownMenuItem, DropdownMenuSlots, IconProps, InputProps } from '../types';
import type { ArrayOrNested, GetItemKeys, NestedItem, DynamicSlots, MergeTypes } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type DropdownMenu = ComponentConfig<typeof theme, AppConfig, 'dropdownMenu'>;
interface DropdownMenuContentProps<T extends ArrayOrNested<DropdownMenuItem>> extends Omit<RekaDropdownMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
    items?: T;
    portal?: boolean | string | HTMLElement;
    sub?: boolean;
    labelKey: GetItemKeys<T>;
    descriptionKey: GetItemKeys<T>;
    /**
     * @IconifyIcon
     */
    checkedIcon?: IconProps['name'];
    /**
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * @IconifyIcon
     */
    externalIcon?: boolean | IconProps['name'];
    size?: DropdownMenu['variants']['size'];
    filter?: boolean | Omit<InputProps, 'modelValue' | 'defaultValue'>;
    filterFields?: string[];
    ignoreFilter?: boolean;
    searchTerm?: string;
    class?: any;
    ui: DropdownMenu['ui'];
    uiOverride?: DropdownMenu['slots'];
}
type DropdownMenuContentSlots<A extends ArrayOrNested<DropdownMenuItem> = ArrayOrNested<DropdownMenuItem>, T extends NestedItem<A> = NestedItem<A>> = Pick<DropdownMenuSlots<A>, 'item' | 'item-leading' | 'item-label' | 'item-description' | 'item-trailing' | 'empty' | 'content-top' | 'content-bottom'> & {
    default?(props?: {}): VNode[];
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
    props: import("vue").PublicProps & __VLS_PrettifyLocal<DropdownMenuContentProps<T> & {
        onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined;
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
        onPointerDownOutside?: ((event: import("reka-ui").PointerDownOutsideEvent) => any) | undefined;
        onFocusOutside?: ((event: import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onInteractOutside?: ((event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onCloseAutoFocus?: ((event: Event) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: DropdownMenuContentSlots<T, NestedItem<T>>;
    emit: ((evt: "escapeKeyDown", event: KeyboardEvent) => void) & ((evt: "update:searchTerm", value: string) => void) & ((evt: "pointerDownOutside", event: import("reka-ui").PointerDownOutsideEvent) => void) & ((evt: "focusOutside", event: import("reka-ui").FocusOutsideEvent) => void) & ((evt: "interactOutside", event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => void) & ((evt: "closeAutoFocus", event: Event) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
