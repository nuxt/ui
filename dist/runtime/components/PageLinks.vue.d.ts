import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-links';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageLinks = ComponentConfig<typeof theme, AppConfig, 'pageLinks'>;
export interface PageLink extends Omit<LinkProps, 'custom'> {
    label: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    class?: any;
    ui?: Pick<PageLinks['slots'], 'item' | 'link' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkLeadingIcon'>;
}
export interface PageLinksProps<T extends PageLink = PageLink> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    title?: string;
    links?: T[];
    class?: any;
    ui?: PageLinks['slots'];
}
type SlotProps<T> = (props: {
    link: T;
    active: boolean;
    ui: PageLinks['ui'];
}) => VNode[];
export interface PageLinksSlots<T extends PageLink = PageLink> {
    'title'?(props?: {}): VNode[];
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
declare const __VLS_export: <T extends PageLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PageLinksProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PageLinksSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
