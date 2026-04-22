import type { VNode } from 'vue';
export interface PageListProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    divide?: boolean;
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface PageListSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageListProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageListProps> & Readonly<{}>, {
    divide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageListSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
