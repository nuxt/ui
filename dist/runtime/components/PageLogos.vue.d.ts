import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-logos';
import type { MarqueeProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageLogos = ComponentConfig<typeof theme, AppConfig, 'pageLogos'>;
type PageLogosItem = {
    src: string;
    alt: string;
} | string;
export interface PageLogosProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    title?: string;
    items?: PageLogosItem[];
    marquee?: boolean | MarqueeProps;
    class?: any;
    ui?: PageLogos['slots'];
}
export interface PageLogosSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageLogosProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageLogosProps> & Readonly<{}>, {
    marquee: boolean | MarqueeProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageLogosSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
