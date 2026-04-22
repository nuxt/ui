import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-section';
import type { ButtonProps, IconProps, PageFeatureProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageSection = ComponentConfig<typeof theme, AppConfig, 'pageSection'>;
export interface PageSectionProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'section'
     */
    as?: any;
    /**
     * The headline displayed above the title.
     */
    headline?: string;
    /**
     * The icon displayed above the title.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    title?: string;
    description?: string;
    /**
     * Display a list of Button under the description.
     * `{ size: 'lg' }`{lang="ts-type"}
     */
    links?: ButtonProps[];
    /**
     * Display a list of PageFeature under the description.
     */
    features?: PageFeatureProps[];
    /**
     * The orientation of the section.
     * @defaultValue 'vertical'
     */
    orientation?: PageSection['variants']['orientation'];
    /**
     * Reverse the order of the default slot.
     * @defaultValue false
     */
    reverse?: boolean;
    class?: any;
    ui?: PageSection['slots'];
}
export interface PageSectionSlots {
    top?(props?: {}): VNode[];
    header?(props?: {}): VNode[];
    leading?(props: {
        ui: PageSection['ui'];
    }): VNode[];
    headline?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    features?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
    links?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    bottom?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageSectionProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageSectionProps> & Readonly<{}>, {
    orientation: PageSection["variants"]["orientation"];
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageSectionSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
