import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/marquee';
import type { ComponentConfig } from '../types/tv';
type Marquee = ComponentConfig<typeof theme, AppConfig, 'marquee'>;
export interface MarqueeProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * Pause the marquee on hover.
     * @defaultValue false
     */
    pauseOnHover?: boolean;
    /**
     * Reverse the direction of the marquee.
     * @defaultValue false
     */
    reverse?: boolean;
    /**
     * The orientation of the marquee.
     * @defaultValue 'horizontal'
     */
    orientation?: Marquee['variants']['orientation'];
    /**
     * The number of times the marquee should repeat.
     * @defaultValue 4
     */
    repeat?: number;
    /**
     * Display an overlay on the marquee.
     * @defaultValue true
     */
    overlay?: boolean;
    class?: any;
    ui?: Marquee['slots'];
}
export interface MarqueeSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<MarqueeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<MarqueeProps> & Readonly<{}>, {
    repeat: number;
    orientation: Marquee["variants"]["orientation"];
    overlay: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, MarqueeSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
