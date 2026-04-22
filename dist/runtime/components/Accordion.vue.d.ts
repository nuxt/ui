import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/accordion';
import type { IconProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Accordion = ComponentConfig<typeof theme, AppConfig, 'accordion'>;
export interface AccordionItem {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    slot?: string;
    content?: string;
    /**
     * A unique value for the accordion item. Defaults to the index.
     * Also used as the Vue `key` for this item, so providing a stable value prevents
     * accordion content (and its local state) from remounting when items are added, removed,
     * or reordered.
     */
    value?: string;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Accordion['slots'], 'item' | 'header' | 'trigger' | 'leadingIcon' | 'label' | 'trailingIcon' | 'content' | 'body'>;
    [key: string]: any;
}
export interface AccordionProps<T extends AccordionItem = AccordionItem> extends Pick<AccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items?: T[];
    /**
     * The icon displayed on the right side of the trigger.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The key used to get the value from the item.
     * @defaultValue 'value'
     */
    valueKey?: GetItemKeys<T>;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    class?: any;
    ui?: Accordion['slots'];
}
export interface AccordionEmits extends AccordionRootEmits {
}
type SlotProps<T extends AccordionItem> = (props: {
    item: T;
    index: number;
    open: boolean;
    ui: Accordion['ui'];
}) => VNode[];
export type AccordionSlots<T extends AccordionItem = AccordionItem> = {
    default?(props: {
        item: T;
        index: number;
        open: boolean;
    }): VNode[];
    leading?: SlotProps<T>;
    trailing?: SlotProps<T>;
    content?: SlotProps<T>;
    body?: SlotProps<T>;
} & DynamicSlots<T, 'body', {
    index: number;
    open: boolean;
    ui: Accordion['ui'];
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends AccordionItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<AccordionProps<T> & {
        "onUpdate:modelValue"?: ((value: string | string[] | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: AccordionSlots<T>;
    emit: (evt: "update:modelValue", value: string | string[] | undefined) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
