import type { DialogRootProps, DialogRootEmits, DialogContentProps, DialogContentEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/modal';
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Modal = ComponentConfig<typeof theme, AppConfig, 'modal'>;
export interface ModalProps extends DialogRootProps {
    title?: string;
    description?: string;
    /** The content of the modal. */
    content?: Omit<DialogContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<DialogContentEmits>>;
    /**
     * Render an overlay behind the modal.
     * @defaultValue true
     */
    overlay?: boolean;
    /**
     * When `true`, enables scrollable overlay mode where content scrolls within the overlay.
     * @defaultValue false
     */
    scrollable?: boolean;
    /**
     * Animate the modal when opening or closing.
     * @defaultValue true
     */
    transition?: boolean;
    /**
     * When `true`, the modal will take up the full screen.
     * @defaultValue false
     */
    fullscreen?: boolean;
    /**
     * Render the modal in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * Display a close button to dismiss the modal.
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
     * When `false`, the modal will not close when clicking outside or pressing escape.
     * @defaultValue true
     */
    dismissible?: boolean;
    class?: any;
    ui?: Modal['slots'];
}
export interface ModalEmits extends DialogRootEmits {
    'after:leave': [];
    'after:enter': [];
    'close:prevent': [];
}
export interface ModalSlots {
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
        ui: Modal['ui'];
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
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ModalProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
    "after:leave": () => any;
    "after:enter": () => any;
    "close:prevent": () => any;
}, string, import("vue").PublicProps, Readonly<ModalProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    "onAfter:leave"?: (() => any) | undefined;
    "onAfter:enter"?: (() => any) | undefined;
    "onClose:prevent"?: (() => any) | undefined;
}>, {
    close: boolean | Omit<ButtonProps, LinkPropsKeys>;
    transition: boolean;
    overlay: boolean;
    modal: boolean;
    portal: boolean | string | HTMLElement;
    dismissible: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ModalSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
