import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/breadcrumb';
import type { AvatarProps, IconProps, LinkProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Breadcrumb = ComponentConfig<typeof theme, AppConfig, 'breadcrumb'>;
export interface BreadcrumbItem extends Omit<LinkProps, 'raw' | 'custom'> {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    slot?: string;
    class?: any;
    ui?: Pick<Breadcrumb['slots'], 'item' | 'link' | 'linkLeadingIcon' | 'linkLeadingAvatar' | 'linkLabel' | 'separator' | 'separatorIcon'>;
    [key: string]: any;
}
export interface BreadcrumbProps<T extends BreadcrumbItem = BreadcrumbItem> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    items?: T[];
    /**
     * The icon to use as a separator.
     * @defaultValue appConfig.ui.icons.chevronRight
     * @IconifyIcon
     */
    separatorIcon?: IconProps['name'];
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    class?: any;
    ui?: Breadcrumb['slots'];
}
type SlotProps<T extends BreadcrumbItem> = (props: {
    item: T;
    index: number;
    active: boolean;
    ui: Breadcrumb['ui'];
}) => VNode[];
export type BreadcrumbSlots<T extends BreadcrumbItem = BreadcrumbItem> = {
    'item'?: SlotProps<T>;
    'item-leading'?: SlotProps<T>;
    'item-label'?: (props: {
        item: T;
        index: number;
        active: boolean;
    }) => VNode[];
    'item-trailing'?: (props: {
        item: T;
        index: number;
        active: boolean;
    }) => VNode[];
    'separator'?: (props: {
        ui: Breadcrumb['ui'];
    }) => VNode[];
} & DynamicSlots<T, 'leading', {
    index: number;
    active: boolean;
    ui: Breadcrumb['ui'];
}> & DynamicSlots<T, 'label' | 'trailing', {
    index: number;
    active: boolean;
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends BreadcrumbItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<BreadcrumbProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: BreadcrumbSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
