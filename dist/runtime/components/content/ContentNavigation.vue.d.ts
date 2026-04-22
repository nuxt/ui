import type { AccordionRootProps, AccordionRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ContentNavigationItem } from '@nuxt/content';
import theme from '#build/ui/content/content-navigation';
import type { BadgeProps, IconProps, LinkProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentNavigation = ComponentConfig<typeof theme, AppConfig, 'contentNavigation'>;
export interface ContentNavigationLink extends ContentNavigationItem {
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * Display a badge on the link.
     * `{ color: 'neutral', variant: 'outline', size: 'sm' }`{lang="ts-type"}
     */
    badge?: string | number | BadgeProps;
    target?: LinkProps['target'];
    /**
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    disabled?: boolean;
    children?: ContentNavigationLink[];
    defaultOpen?: boolean;
    active?: boolean;
    class?: any;
    ui?: Pick<ContentNavigation['slots'], 'link' | 'linkLeadingIcon' | 'linkTitle' | 'linkTrailing' | 'linkTrailingIcon' | 'linkTrailingBadge' | 'linkTrailingBadgeSize' | 'linkTrailingIcon' | 'linkTitleExternalIcon' | 'trigger' | 'content' | 'item' | 'itemWithChildren'>;
}
export interface ContentNavigationProps<T extends ContentNavigationLink = ContentNavigationLink> extends Pick<AccordionRootProps, 'disabled' | 'type' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'nav'
     */
    as?: any;
    /**
     * When `true`, the tree will be opened based on the current route.
     * When `false`, the tree will be closed.
     * When `undefined` (default), the first item will be opened with `type="single"` and the first level will be opened with `type="multiple"`.
     */
    defaultOpen?: boolean;
    /**
     * The icon displayed to toggle the accordion.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * @defaultValue 'primary'
     */
    color?: ContentNavigation['variants']['color'];
    /**
     * @defaultValue 'pill'
     */
    variant?: ContentNavigation['variants']['variant'];
    /**
     * Display a line next to the active link.
     * @defaultValue false
     */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: ContentNavigation['variants']['highlightColor'];
    /**
     * When type is "single", prevents closing the open item when clicking its trigger.
     * When type is "multiple", disables the collapsible behavior.
     * @defaultValue true
     */
    collapsible?: boolean;
    level?: number;
    navigation?: T[];
    class?: any;
    ui?: ContentNavigation['slots'];
}
export interface ContentNavigationEmits extends AccordionRootEmits {
}
type SlotProps<T> = (props: {
    link: T;
    active: boolean;
    ui: ContentNavigation['ui'];
}) => VNode[];
export interface ContentNavigationSlots<T extends ContentNavigationLink = ContentNavigationLink> {
    'link'?: SlotProps<T>;
    'link-leading'?: SlotProps<T>;
    'link-title'?: SlotProps<T>;
    'link-trailing'?: SlotProps<T>;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ContentNavigationLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ContentNavigationProps<T> & {
        "onUpdate:modelValue"?: ((value: string | string[] | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContentNavigationSlots<T>;
    emit: (evt: "update:modelValue", value: string | string[] | undefined) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
