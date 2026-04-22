import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/sidebar';
import type { ButtonProps, DrawerProps, IconProps, ModalProps, SlideoverProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type Sidebar = ComponentConfig<typeof theme, AppConfig, 'sidebar'>;
type SidebarState = 'expanded' | 'collapsed';
type SidebarMode = 'modal' | 'slideover' | 'drawer';
type SidebarMenu<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never;
export interface SidebarProps<T extends SidebarMode = SidebarMode> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'aside'
     */
    as?: any;
    /**
     * The visual variant of the sidebar.
     * @defaultValue 'sidebar'
     */
    variant?: Sidebar['variants']['variant'];
    /**
     * The collapse behavior of the sidebar.
     * - `offcanvas`: The sidebar slides out of view completely.
     * - `icon`: The sidebar shrinks to icon-only width.
     * - `none`: The sidebar is not collapsible.
     * @defaultValue 'offcanvas'
     */
    collapsible?: Sidebar['variants']['collapsible'];
    /**
     * The side to render the sidebar on.
     * @defaultValue 'left'
     */
    side?: Sidebar['variants']['side'];
    /**
     * The title displayed in the sidebar header.
     */
    title?: string;
    /**
     * The description displayed in the sidebar header.
     */
    description?: string;
    /**
     * Display a close button to collapse the sidebar.
     * Only renders when `collapsible` is not `none`.
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @defaultValue false
     */
    close?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: IconProps['name'];
    /**
     * Display a rail on the sidebar edge to toggle collapse.
     * Only renders when `collapsible` is not `none`.
     * @defaultValue false
     */
    rail?: boolean;
    /**
     * The mode of the sidebar menu on mobile.
     * @defaultValue 'slideover'
     */
    mode?: T;
    /**
     * The props for the sidebar menu component on mobile.
     */
    menu?: SidebarMenu<T>;
    class?: any;
    ui?: Sidebar['slots'];
}
export interface SidebarSlots {
    header?(props: {
        state: SidebarState;
        open: boolean;
        close: () => void;
    }): VNode[];
    title?(props: {
        state: SidebarState;
    }): VNode[];
    description?(props: {
        state: SidebarState;
    }): VNode[];
    actions?(props: {
        state: SidebarState;
    }): VNode[];
    close?(props: {
        ui: Sidebar['ui'];
        state: SidebarState;
    }): VNode[];
    default?(props: {
        state: SidebarState;
        open: boolean;
        close: () => void;
    }): VNode[];
    footer?(props: {
        state: SidebarState;
        open: boolean;
        close: () => void;
    }): VNode[];
    rail?(props: {
        ui: Sidebar['ui'];
        state: SidebarState;
    }): VNode[];
    content?(props: {
        close: () => void;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends SidebarMode>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(SidebarProps<T> & {
        open?: boolean;
    }) & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: SidebarSlots;
    emit: (event: "update:open", value: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
