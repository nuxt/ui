import type { VNode } from 'vue';
export interface ProseAProps {
    href?: string;
    target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined;
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface ProseASlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseAProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseAProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseASlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
