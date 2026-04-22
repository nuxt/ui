import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/h3';
import type { ComponentConfig } from '../../types/tv';
type ProseH3 = ComponentConfig<typeof theme, AppConfig, 'h3', 'ui.prose'>;
export interface ProseH3Props {
    id?: string;
    class?: any;
    ui?: ProseH3['slots'];
}
export interface ProseH3Slots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseH3Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseH3Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseH3Slots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
