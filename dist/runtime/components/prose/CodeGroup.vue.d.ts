import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/code-group';
type ProseCodeGroup = ComponentConfig<typeof theme, AppConfig, 'codeGroup', 'ui.prose'>;
export interface ProseCodeGroupProps {
    /**
     * The default tab to select.
     * @example '1'
     */
    defaultValue?: string;
    /**
     * Sync the selected tab with a local storage key.
     */
    sync?: string;
    class?: any;
    ui?: ProseCodeGroup['slots'];
}
export interface ProseCodeGroupSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodeGroupProps & {
    modelValue?: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<ProseCodeGroupProps & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    defaultValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodeGroupSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
