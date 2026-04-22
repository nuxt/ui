import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-cta';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageCTA = ComponentConfig<typeof theme, AppConfig, 'pageCTA'>;
export interface PageCTAProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    class?: any;
    title?: string;
    description?: string;
    /**
     * The orientation of the page cta.
     * @defaultValue 'vertical'
     */
    orientation?: PageCTA['variants']['orientation'];
    /**
     * Reverse the order of the default slot.
     * @defaultValue false
     */
    reverse?: boolean;
    /**
     * @defaultValue 'outline'
     */
    variant?: PageCTA['variants']['variant'];
    /**
     * Display a list of Button under the description.
     * `{ size: 'lg' }`{lang="ts-type"}
     */
    links?: ButtonProps[];
    ui?: PageCTA['slots'];
}
export interface PageCTASlots {
    top?(props?: {}): VNode[];
    header?(props?: {}): VNode[];
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
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageCTAProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageCTAProps> & Readonly<{}>, {
    reverse: boolean;
    orientation: PageCTA["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageCTASlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
