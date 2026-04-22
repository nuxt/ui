import { TreeItem } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/code-tree';
import type { ComponentConfig } from '../../types/tv';
type ProseCodeTree = ComponentConfig<typeof theme, AppConfig, 'codeTree', 'ui.prose'>;
type TreeItem = {
    label: string;
    icon?: string;
    component: any;
};
export interface ProseCodeTreeProps {
    items?: TreeItem[];
    /**
     * The selected path.
     * @example 'package.json'
     */
    modelValue?: string;
    /**
     * The default path to select.
     * @example 'package.json'
     */
    defaultValue?: string;
    /**
     * Expand all directories by default.
     * @defaultValue false
     */
    expandAll?: boolean;
    class?: any;
    ui?: ProseCodeTree['slots'];
}
export interface ProseCodeTreeEmits {
    'update:modelValue': [value: string | undefined];
}
export interface ProseCodeTreeSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodeTreeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<ProseCodeTreeProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodeTreeSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
