import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/empty';
import type { ComponentConfig } from '../types/tv';
import type { ButtonProps, IconProps, AvatarProps } from '../types';
type Empty = ComponentConfig<typeof theme, AppConfig, 'empty'>;
export interface EmptyProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed above the title.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    title?: string;
    description?: string;
    /**
     * Display a list of Button in the body.
     */
    actions?: ButtonProps[];
    /**
     * @defaultValue 'outline'
     */
    variant?: Empty['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Empty['variants']['size'];
    class?: any;
    ui?: Empty['slots'];
}
export interface EmptySlots {
    header?(props?: {}): VNode[];
    leading?(props: {
        ui: Empty['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    actions?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<EmptyProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<EmptyProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, EmptySlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
