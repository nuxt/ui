import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/h2';
import type { ComponentConfig } from '../../types/tv';
type ProseH2 = ComponentConfig<typeof theme, AppConfig, 'h2', 'ui.prose'>;
export interface ProseH2Props {
    id?: string;
    class?: any;
    ui?: ProseH2['slots'];
}
export interface ProseH2Slots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseH2Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseH2Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseH2Slots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
