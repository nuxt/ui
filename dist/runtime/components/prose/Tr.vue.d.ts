import type { VNode } from 'vue';
export interface ProseTrProps {
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface ProseTrSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseTrProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseTrProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseTrSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
