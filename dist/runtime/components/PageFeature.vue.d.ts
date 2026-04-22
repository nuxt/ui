import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-feature';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageFeature = ComponentConfig<typeof theme, AppConfig, 'pageFeature'>;
export interface PageFeatureProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed next to the title when `orientation` is `horizontal` and above the title when `orientation` is `vertical`.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    title?: string;
    description?: string;
    /**
     * The orientation of the page feature.
     * @defaultValue 'horizontal'
     */
    orientation?: PageFeature['variants']['orientation'];
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    onClick?: (event: MouseEvent) => void | Promise<void>;
    class?: any;
    ui?: PageFeature['slots'];
}
export interface PageFeatureSlots {
    leading?(props: {
        ui: PageFeature['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageFeatureProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageFeatureProps> & Readonly<{}>, {
    orientation: PageFeature["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageFeatureSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
