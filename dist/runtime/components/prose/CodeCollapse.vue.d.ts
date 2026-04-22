import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/code-collapse';
import type { IconProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseCodeCollapse = ComponentConfig<typeof theme, AppConfig, 'codeCollapse', 'ui.prose'>;
export interface ProseCodeCollapseProps {
    /**
     * The icon displayed to toggle the code.
     * @defaultValue appConfig.ui.icons.chevronDown
     */
    icon?: IconProps['name'];
    /**
     * The name displayed in the trigger label.
     * @defaultValue t('prose.codeCollapse.name')
     */
    name?: string;
    /**
     * The text displayed when the code is collapsed.
     * @defaultValue t('prose.codeCollapse.openText')
     */
    openText?: string;
    /**
     * The text displayed when the code is expanded.
     * @defaultValue t('prose.codeCollapse.closeText')
     */
    closeText?: string;
    class?: any;
    ui?: ProseCodeCollapse['slots'];
}
export interface ProseCodeCollapseSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCodeCollapseProps & {
    open?: boolean;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<ProseCodeCollapseProps & {
    open?: boolean;
}> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCodeCollapseSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
