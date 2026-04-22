import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/card';
import type { ComponentConfig } from '../types/tv';
type Card = ComponentConfig<typeof theme, AppConfig, 'card'>;
export interface CardProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'outline'
     */
    variant?: Card['variants']['variant'];
    class?: any;
    ui?: Card['slots'];
}
export interface CardSlots {
    header?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<CardProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<CardProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, CardSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
