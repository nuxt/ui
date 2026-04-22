import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../types/tv';
import theme from '#build/ui/footer';
type Footer = ComponentConfig<typeof theme, AppConfig, 'footer'>;
export interface FooterProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'footer'
     */
    as?: any;
    class?: any;
    ui?: Footer['slots'];
}
export interface FooterSlots {
    left?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
    right?(props?: {}): VNode[];
    top?(props?: {}): VNode[];
    bottom?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<FooterProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FooterProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, FooterSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
