import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-header';
import type { ButtonProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageHeader = ComponentConfig<typeof theme, AppConfig, 'pageHeader'>;
export interface PageHeaderProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    headline?: string;
    title?: string;
    description?: string;
    /**
     * Display a list of Button next to the title.
     * `{ color: 'neutral', variant: 'outline' }`{lang="ts-type"}
     */
    links?: ButtonProps[];
    class?: any;
    ui?: PageHeader['slots'];
}
export interface PageHeaderSlots {
    headline?(props?: {}): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    links?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageHeaderProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageHeaderProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageHeaderSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
