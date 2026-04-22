import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/alert';
import type { AvatarProps, ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type Alert = ComponentConfig<typeof theme, AppConfig, 'alert'>;
export interface AlertProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    title?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    /**
     * @defaultValue 'primary'
     */
    color?: Alert['variants']['color'];
    /**
     * @defaultValue 'solid'
     */
    variant?: Alert['variants']['variant'];
    /**
     * The orientation between the content and the actions.
     * @defaultValue 'vertical'
     */
    orientation?: Alert['variants']['orientation'];
    /**
     * Display a list of actions:
     * - under the title and description when orientation is `vertical`
     * - next to the close button when orientation is `horizontal`
     * `{ size: 'xs' }`{lang="ts-type"}
     */
    actions?: ButtonProps[];
    /**
     * Display a close button to dismiss the alert.
     * `{ size: 'md', color: 'neutral', variant: 'link' }`{lang="ts-type"}
     * @emits 'update:open'
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
    ui?: Alert['slots'];
}
export interface AlertEmits {
    'update:open': [value: boolean];
}
export interface AlertSlots {
    leading?(props: {
        ui: Alert['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    actions?(props?: {}): VNode[];
    close?(props: {
        ui: Alert['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<AlertProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<AlertProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    orientation: Alert["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, AlertSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
