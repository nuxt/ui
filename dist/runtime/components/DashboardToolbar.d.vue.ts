import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dashboard-toolbar';
import type { ComponentConfig } from '../types/tv';
type DashboardToolbar = ComponentConfig<typeof theme, AppConfig, 'dashboardToolbar'>;
export interface DashboardToolbarProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    class?: any;
    ui?: DashboardToolbar['slots'];
}
export interface DashboardToolbarSlots {
    default?(props?: {}): VNode[];
    left?(props?: {}): VNode[];
    right?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DashboardToolbarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardToolbarProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, DashboardToolbarSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
