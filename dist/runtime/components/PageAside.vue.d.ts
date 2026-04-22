import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-aside';
import type { ComponentConfig } from '../types/tv';
type PageAside = ComponentConfig<typeof theme, AppConfig, 'pageAside'>;
export interface PageAsideProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'aside'
     */
    as?: any;
    class?: any;
    ui?: PageAside['slots'];
}
export interface PageAsideSlots {
    top?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    bottom?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageAsideProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageAsideProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageAsideSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
