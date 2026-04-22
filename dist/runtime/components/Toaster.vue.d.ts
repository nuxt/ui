import type { ToastProviderProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/toaster';
import type { ComponentConfig } from '../types/tv';
type Toaster = ComponentConfig<typeof theme, AppConfig, 'toaster'>;
export interface ToasterProps extends Omit<ToastProviderProps, 'swipeDirection'> {
    /**
     * The position on the screen to display the toasts.
     * @defaultValue 'bottom-right'
     */
    position?: Toaster['variants']['position'];
    /**
     * Expand the toasts to show multiple toasts at once.
     * @defaultValue true
     */
    expand?: boolean;
    /**
     * Whether to show the progress bar on all toasts.
     * @defaultValue true
     */
    progress?: boolean;
    /**
     * Render the toaster in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * Maximum number of toasts to display at once.
     * @defaultValue 5
     */
    max?: number;
    class?: any;
    ui?: Toaster['slots'];
}
export interface ToasterSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ToasterProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ToasterProps> & Readonly<{}>, {
    progress: boolean;
    max: number;
    expand: boolean;
    duration: number;
    portal: boolean | string | HTMLElement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ToasterSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
