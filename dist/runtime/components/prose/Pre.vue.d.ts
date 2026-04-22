import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/pre';
import type { IconProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProsePre = ComponentConfig<typeof theme, AppConfig, 'pre', 'ui.prose'>;
export interface ProsePreProps {
    icon?: IconProps['name'];
    code?: string;
    language?: string;
    filename?: string;
    highlights?: number[];
    hideHeader?: boolean;
    meta?: string;
    class?: any;
    ui?: ProsePre['slots'];
}
export interface ProsePreSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProsePreProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProsePreProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProsePreSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
