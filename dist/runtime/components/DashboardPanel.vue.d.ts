import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dashboard-panel';
import type { UseResizableProps } from '../composables/useResizable';
import type { ComponentConfig } from '../types/tv';
type DashboardPanel = ComponentConfig<typeof theme, AppConfig, 'dashboardPanel'>;
export interface DashboardPanelProps extends Pick<UseResizableProps, 'id' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable'> {
    class?: any;
    ui?: DashboardPanel['slots'];
}
export interface DashboardPanelSlots {
    'default'?(props?: {}): VNode[];
    'header'?(props?: {}): VNode[];
    'body'?(props?: {}): VNode[];
    'footer'?(props?: {}): VNode[];
    'resize-handle'?(props: {
        onMouseDown: (e: MouseEvent) => void;
        onTouchStart: (e: TouchEvent) => void;
        onDoubleClick: (e: MouseEvent) => void;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DashboardPanelProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardPanelProps> & Readonly<{}>, {
    minSize: number;
    resizable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, DashboardPanelSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
