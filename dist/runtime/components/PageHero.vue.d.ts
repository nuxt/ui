import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-hero';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageHero = ComponentConfig<typeof theme, AppConfig, 'pageHero'>;
export interface PageHeroProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    headline?: string;
    title?: string;
    description?: string;
    /**
     * Display a list of Button under the description.
     * `{ size: 'xl' }`{lang="ts-type"}
     */
    links?: ButtonProps[];
    /**
     * The orientation of the page hero.
     * @defaultValue 'vertical'
     */
    orientation?: PageHero['variants']['orientation'];
    /**
     * Reverse the order of the default slot.
     * @defaultValue false
     */
    reverse?: boolean;
    class?: any;
    ui?: PageHero['slots'];
}
export interface PageHeroSlots {
    top?(props?: {}): VNode[];
    header?(props?: {}): VNode[];
    headline?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
    links?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    bottom?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageHeroProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageHeroProps> & Readonly<{}>, {
    orientation: PageHero["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageHeroSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
