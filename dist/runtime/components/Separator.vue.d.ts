import { Separator } from 'reka-ui';
import type { SeparatorProps as _SeparatorProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/separator';
import type { AvatarProps, IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type Separator = ComponentConfig<typeof theme, AppConfig, 'separator'>;
export interface SeparatorProps extends Pick<_SeparatorProps, 'decorative'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** Display a label in the middle. */
    label?: string;
    /**
     * Display an icon in the middle.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /** Display an avatar in the middle. */
    avatar?: AvatarProps;
    /**
     * @defaultValue 'neutral'
     */
    color?: Separator['variants']['color'];
    /**
     * @defaultValue 'xs'
     */
    size?: Separator['variants']['size'];
    /**
     * @defaultValue 'solid'
     */
    type?: Separator['variants']['type'];
    /**
     * The orientation of the separator.
     * @defaultValue 'horizontal'
     */
    orientation?: Separator['variants']['orientation'];
    class?: any;
    ui?: Separator['slots'];
}
export interface SeparatorSlots {
    default?(props: {
        ui: Separator['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<SeparatorProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<SeparatorProps> & Readonly<{}>, {
    orientation: Separator["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, SeparatorSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
