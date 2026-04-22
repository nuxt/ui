import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/h1';
type ProseH1 = ComponentConfig<typeof theme, AppConfig, 'h1', 'ui.prose'>;
export interface ProseH1Props {
    id?: string;
    class?: any;
    ui?: ProseH1['slots'];
}
export interface ProseH1Slots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseH1Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseH1Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseH1Slots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
