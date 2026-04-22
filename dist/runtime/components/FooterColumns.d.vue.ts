import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/footer-columns';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type FooterColumns = ComponentConfig<typeof theme, AppConfig, 'footerColumns'>;
export interface FooterColumnLink extends Omit<LinkProps, 'custom'> {
    label: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    class?: any;
    ui?: Pick<FooterColumns['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeadingIcon'>;
}
export interface FooterColumn<T extends FooterColumnLink = FooterColumnLink> {
    label: string;
    children?: T[];
}
export interface FooterColumnsProps<T extends FooterColumnLink = FooterColumnLink> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    class?: any;
    columns?: FooterColumn<T>[];
    ui?: FooterColumns['slots'];
}
type SlotProps<T> = (props: {
    link: T;
    active: boolean;
    ui: FooterColumns['ui'];
}) => VNode[];
export interface FooterColumnsSlots<T extends FooterColumnLink = FooterColumnLink> {
    'left'?(props?: {}): VNode[];
    'default'?(props?: {}): VNode[];
    'right'?(props?: {}): VNode[];
    'column-label'?: (props: {
        column: FooterColumn<T>;
    }) => VNode[];
    'link'?: SlotProps<T>;
    'link-leading'?: SlotProps<T>;
    'link-label'?(props: {
        link: T;
        active: boolean;
    }): VNode[];
    'link-trailing'?(props: {
        link: T;
        active: boolean;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends FooterColumnLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<FooterColumnsProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: FooterColumnsSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
