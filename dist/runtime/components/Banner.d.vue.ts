import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/banner';
import type { ButtonProps, IconProps, LinkProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type Banner = ComponentConfig<typeof theme, AppConfig, 'banner'>;
export interface BannerProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * A unique id saved to local storage to remember if the banner has been dismissed.
     * Without an explicit id, the banner will not be persisted and will reappear on page reload.
     */
    id?: string;
    /**
     * The icon displayed next to the title.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    title?: string;
    /**
     * Display a list of actions next to the title.
     * `{ color: 'neutral', size: 'xs' }`{lang="ts-type"}
     */
    actions?: ButtonProps[];
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    /**
     * @defaultValue 'primary'
     */
    color?: Banner['variants']['color'];
    /**
     * Display a close button to dismiss the banner.
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @emits `close`
     * @defaultValue false
     */
    close?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: IconProps['name'];
    class?: any;
    ui?: Banner['slots'];
}
export interface BannerSlots {
    leading?(props: {
        ui: Banner['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    actions?(props?: {}): VNode[];
    close?(props: {
        ui: Banner['ui'];
    }): VNode[];
}
export interface BannerEmits {
    close: [];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<BannerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => any;
}, string, import("vue").PublicProps, Readonly<BannerProps> & Readonly<{
    onClose?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, BannerSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
