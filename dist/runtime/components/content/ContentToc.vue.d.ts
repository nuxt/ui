import type { CollapsibleRootProps, CollapsibleRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { TocLink } from '@nuxt/content';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/content/content-toc';
import type { IconProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentToc = ComponentConfig<typeof theme, AppConfig, 'contentToc'>;
export type ContentTocLink = TocLink & {
    class?: any;
    ui?: Pick<ContentToc['slots'], 'item' | 'itemWithChildren' | 'link' | 'linkText'>;
};
export interface ContentTocProps<T extends ContentTocLink = ContentTocLink> extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    /**
     * The icon displayed to collapse the content.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The title of the table of contents.
     * @defaultValue t('contentToc.title')
     */
    title?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: ContentToc['variants']['color'];
    /**
     * Display a line next to the active link.
     * @defaultValue false
     */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: ContentToc['variants']['highlightColor'];
    /**
     * The variant of the highlight indicator.
     * @defaultValue 'straight'
     */
    highlightVariant?: ContentToc['variants']['highlightVariant'];
    links?: T[];
    class?: any;
    ui?: ContentToc['slots'];
}
export type ContentTocEmits = CollapsibleRootEmits & {
    move: [id: string];
};
type SlotProps<T> = (props: {
    link: T;
}) => VNode[];
export interface ContentTocSlots<T extends ContentTocLink = ContentTocLink> {
    leading?(props: {
        open: boolean;
        ui: ContentToc['ui'];
    }): VNode[];
    default?(props: {
        open: boolean;
    }): VNode[];
    trailing?(props: {
        open: boolean;
        ui: ContentToc['ui'];
    }): VNode[];
    content?(props: {
        links: T[];
    }): VNode[];
    link?: SlotProps<T>;
    top?(props: {
        links?: T[];
    }): VNode[];
    bottom?(props: {
        links?: T[];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ContentTocLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ContentTocProps<T> & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        onMove?: ((id: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContentTocSlots<T>;
    emit: ((evt: "update:open", value: boolean) => void) & ((evt: "move", id: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
