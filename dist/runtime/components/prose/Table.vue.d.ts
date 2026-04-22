import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/table';
type ProseTable = ComponentConfig<typeof theme, AppConfig, 'table', 'ui.prose'>;
export interface ProseTableProps {
    class?: any;
    ui?: ProseTable['slots'];
}
export interface ProseTableSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseTableProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseTableProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseTableSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
