import type { VNode } from 'vue';
import type { ContentNavigationItem } from '@nuxt/content';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/content/content-surround';
import type { IconProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentSurround = ComponentConfig<typeof theme, AppConfig, 'contentSurround'>;
export interface ContentSurroundLink extends ContentNavigationItem {
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    class?: any;
    ui?: Pick<ContentSurround['slots'], 'link' | 'linkLeading' | 'linkLeadingIcon' | 'linkTitle' | 'linkDescription'>;
}
export interface ContentSurroundProps<T extends ContentSurroundLink = ContentSurroundLink> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed in the prev link.
     * @defaultValue appConfig.ui.icons.arrowLeft
     * @IconifyIcon
     */
    prevIcon?: IconProps['name'];
    /**
     * The icon displayed in the next link.
     * @defaultValue appConfig.ui.icons.arrowRight
     * @IconifyIcon
     */
    nextIcon?: IconProps['name'];
    surround?: T[];
    class?: any;
    ui?: ContentSurround['slots'];
}
type SlotProps<T> = (props: {
    link: T;
    ui: ContentSurround['ui'];
}) => VNode[];
export interface ContentSurroundSlots<T extends ContentSurroundLink = ContentSurroundLink> {
    'link'?: SlotProps<T>;
    'link-leading'?: SlotProps<T>;
    'link-title'?: SlotProps<T>;
    'link-description'?: SlotProps<T>;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ContentSurroundLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ContentSurroundProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContentSurroundSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
