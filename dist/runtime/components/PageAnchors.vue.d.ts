import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-anchors';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageAnchors = ComponentConfig<typeof theme, AppConfig, 'pageAnchors'>;
export interface PageAnchor extends Omit<LinkProps, 'custom'> {
    label: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    class?: any;
    ui?: Pick<PageAnchors['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeading' | 'linkLeadingIcon'>;
}
export interface PageAnchorsProps<T extends PageAnchor = PageAnchor> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    links?: T[];
    class?: any;
    ui?: PageAnchors['slots'];
}
type SlotProps<T> = (props: {
    link: T;
    active: boolean;
    ui: PageAnchors['ui'];
}) => VNode[];
export interface PageAnchorsSlots<T extends PageAnchor = PageAnchor> {
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
declare const __VLS_export: <T extends PageAnchor>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PageAnchorsProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PageAnchorsSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
