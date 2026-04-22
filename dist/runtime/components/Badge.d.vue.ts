import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/badge';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { ComponentConfig } from '../types/tv';
type Badge = ComponentConfig<typeof theme, AppConfig, 'badge'>;
export interface BadgeProps extends Omit<UseComponentIconsProps, 'loading' | 'loadingIcon'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'span'
     */
    as?: any;
    label?: string | number;
    /**
     * @defaultValue 'primary'
     */
    color?: Badge['variants']['color'];
    /**
     * @defaultValue 'solid'
     */
    variant?: Badge['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Badge['variants']['size'];
    /** Render the badge with equal padding on all sides. */
    square?: boolean;
    class?: any;
    ui?: Badge['slots'];
}
export interface BadgeSlots {
    leading?(props: {
        ui: Badge['ui'];
    }): VNode[];
    default?(props: {
        ui: Badge['ui'];
    }): VNode[];
    trailing?(props: {
        ui: Badge['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<BadgeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BadgeProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, BadgeSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
