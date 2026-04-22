import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/code-preview';
type ProseCodePreview = ComponentConfig<typeof theme, AppConfig, 'codePreview', 'ui.prose'>;
export interface ProseCodePreviewProps {
    class?: any;
    ui?: ProseCodePreview['slots'];
}
export interface ProseCodePreviewSlots {
    default(props?: {}): VNode[];
    code(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodePreviewProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCodePreviewProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodePreviewSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
