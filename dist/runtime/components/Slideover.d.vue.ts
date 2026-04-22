import type { DialogRootProps, DialogRootEmits, DialogContentProps, DialogContentEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/slideover';
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Slideover = ComponentConfig<typeof theme, AppConfig, 'slideover'>;
export interface SlideoverProps extends DialogRootProps {
    title?: string;
    description?: string;
    /** The content of the slideover. */
    content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>;
    /**
     * Render an overlay behind the slideover.
     * @defaultValue true
     */
    overlay?: boolean;
    /**
     * Animate the slideover when opening or closing.
     * @defaultValue true
     */
    transition?: boolean;
    /**
     * The side of the slideover.
     * @defaultValue 'right'
     */
    side?: Slideover['variants']['side'];
    /**
     * Whether to inset the slideover from the edges.
     * @defaultValue false
     */
    inset?: boolean;
    /**
     * Render the slideover in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * Display a close button to dismiss the slideover.
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @defaultValue true
     */
    close?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: IconProps['name'];
    /**
     * When `false`, the slideover will not close when clicking outside or pressing escape.
     * @defaultValue true
     */
    dismissible?: boolean;
    class?: any;
    ui?: Slideover['slots'];
}
export interface SlideoverEmits extends DialogRootEmits {
    'after:leave': [];
    'after:enter': [];
    'close:prevent': [];
}
export interface SlideoverSlots {
    default?(props: {
        open: boolean;
    }): VNode[];
    content?(props: {
        close: () => void;
    }): VNode[];
    header?(props: {
        close: () => void;
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    actions?(props?: {}): VNode[];
    close?(props: {
        ui: Slideover['ui'];
    }): VNode[];
    body?(props: {
        close: () => void;
    }): VNode[];
    footer?(props: {
        close: () => void;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<SlideoverProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
    "after:leave": () => any;
    "after:enter": () => any;
    "close:prevent": () => any;
}, string, import("vue").PublicProps, Readonly<SlideoverProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    "onAfter:leave"?: (() => any) | undefined;
    "onAfter:enter"?: (() => any) | undefined;
    "onClose:prevent"?: (() => any) | undefined;
}>, {
    close: boolean | Omit<ButtonProps, LinkPropsKeys>;
    transition: boolean;
    side: Slideover["variants"]["side"];
    overlay: boolean;
    modal: boolean;
    portal: boolean | string | HTMLElement;
    dismissible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, SlideoverSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
