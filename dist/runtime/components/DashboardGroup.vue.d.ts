import type { VNode } from 'vue';
import type { UseResizableProps } from '../composables/useResizable';
export interface DashboardGroupProps extends Pick<UseResizableProps, 'storage' | 'storageKey' | 'persistent' | 'unit'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface DashboardGroupSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DashboardGroupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardGroupProps> & Readonly<{}>, {
    storage: "cookie" | "local";
    unit: "%" | "rem" | "px";
    storageKey: string;
    persistent: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, DashboardGroupSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
