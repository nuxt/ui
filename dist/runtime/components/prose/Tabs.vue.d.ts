import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/tabs';
import type { TabsProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseTabs = ComponentConfig<typeof theme, AppConfig, 'tabs', 'ui.prose'>;
export interface ProseTabsProps {
    /**
     * The default tab to select.
     * @example '1'
     */
    defaultValue?: string;
    /**
     * Sync the selected tab with a local storage key.
     */
    sync?: string;
    /**
     * The hash to scroll to when the tab is selected.
     */
    hash?: string;
    class?: any;
    ui?: ProseTabs['slots'] & TabsProps['ui'];
}
export interface ProseTabsSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseTabsProps & {
    modelValue?: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<ProseTabsProps & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    defaultValue: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseTabsSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
