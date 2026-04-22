import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/header';
import type { ButtonProps, DrawerProps, ModalProps, SlideoverProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type Header = ComponentConfig<typeof theme, AppConfig, 'header'>;
type HeaderMode = 'modal' | 'slideover' | 'drawer';
type HeaderMenu<T> = T extends 'modal' ? ModalProps : T extends 'slideover' ? SlideoverProps : T extends 'drawer' ? DrawerProps : never;
export interface HeaderProps<T extends HeaderMode = HeaderMode> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'header'
     */
    as?: any;
    title?: string;
    to?: string;
    /**
     * The mode of the header menu.
     * @defaultValue 'modal'
     */
    mode?: T;
    /**
     * The props for the header menu component.
     */
    menu?: HeaderMenu<T>;
    /**
     * Customize the toggle button to open the header menu displayed when the `content` slot is used.
     * `{ color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    toggle?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The side to render the toggle button on.
     * @defaultValue 'right'
     */
    toggleSide?: 'left' | 'right';
    /**
     * Automatically close when route changes.
     * @defaultValue true
     */
    autoClose?: boolean;
    class?: any;
    ui?: Header['slots'];
}
export interface HeaderSlots {
    title?(props?: {}): VNode[];
    left?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    right?(props?: {}): VNode[];
    toggle?(props: {
        open: boolean;
        toggle: () => void;
        ui: Header['ui'];
    }): VNode[];
    top?(props?: {}): VNode[];
    bottom?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    content?(props: {
        close?: () => void;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends HeaderMode>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(HeaderProps<T> & {
        open?: boolean;
    }) & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: HeaderSlots;
    emit: (event: "update:open", value: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
