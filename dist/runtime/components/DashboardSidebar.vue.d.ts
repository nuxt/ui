import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dashboard-sidebar';
import type { UseResizableProps } from '../composables/useResizable';
import type { ButtonProps, DrawerProps, ModalProps, SlideoverProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type DashboardSidebar = ComponentConfig<typeof theme, AppConfig, 'dashboardSidebar'>;
type DashboardSidebarMode = 'modal' | 'slideover' | 'drawer';
type DashboardSidebarMenu<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never;
export interface DashboardSidebarProps<T extends DashboardSidebarMode = DashboardSidebarMode> extends Pick<UseResizableProps, 'id' | 'side' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable' | 'collapsible' | 'collapsedSize'> {
    /**
     * The mode of the sidebar menu.
     * @defaultValue 'modal'
     */
    mode?: T;
    /**
     * The props for the sidebar menu component.
     */
    menu?: DashboardSidebarMenu<T>;
    /**
     * Customize the toggle button to open the sidebar.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @defaultValue true
     */
    toggle?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The side to render the toggle button on.
     * @defaultValue 'left'
     */
    toggleSide?: 'left' | 'right';
    /**
     * Automatically close when route changes.
     * @defaultValue true
     */
    autoClose?: boolean;
    class?: any;
    ui?: DashboardSidebar['slots'];
}
export interface DashboardSidebarSlots {
    'header'?(props: {
        collapsed: boolean;
        collapse: (value: boolean) => void;
    }): VNode[];
    'default'?(props: {
        collapsed: boolean;
        collapse: (value: boolean) => void;
    }): VNode[];
    'footer'?(props: {
        collapsed: boolean;
        collapse: (value: boolean) => void;
    }): VNode[];
    'toggle'?(props: {
        open: boolean;
        toggle: () => void;
        ui: DashboardSidebar['ui'];
    }): VNode[];
    'content'?(props: {
        close?: () => void;
    }): VNode[];
    'resize-handle'?(props: {
        onMouseDown: (e: MouseEvent) => void;
        onTouchStart: (e: TouchEvent) => void;
        onDoubleClick: (e: MouseEvent) => void;
        ui: DashboardSidebar['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends DashboardSidebarMode>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(DashboardSidebarProps<T> & {
        open?: boolean;
        collapsed?: boolean;
    }) & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        "onUpdate:collapsed"?: ((value: boolean) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: DashboardSidebarSlots;
    emit: ((event: "update:open", value: boolean) => void) & ((event: "update:collapsed", value: boolean) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
