import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/code';
type ProseCode = ComponentConfig<typeof theme, AppConfig, 'code', 'ui.prose'>;
export interface ProseCodeProps {
    lang?: string;
    /**
     * @defaultValue 'neutral'
     */
    color?: ProseCode['variants']['color'];
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface ProseCodeSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCodeProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodeSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
