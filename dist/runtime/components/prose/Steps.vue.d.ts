import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/steps';
type ProseSteps = ComponentConfig<typeof theme, AppConfig, 'steps', 'ui.prose'>;
export interface ProseStepsProps {
    /**
     * The heading level to apply to the steps.
     * @defaultValue '3'
     */
    level?: ProseSteps['variants']['level'];
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface ProseStepsSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseStepsProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseStepsProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseStepsSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
