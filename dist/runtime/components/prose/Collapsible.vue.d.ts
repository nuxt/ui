import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/collapsible';
import type { IconProps, CollapsibleProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseCollapsible = ComponentConfig<typeof theme, AppConfig, 'collapsible', 'ui.prose'>;
export interface ProseCollapsibleProps {
    /**
     * The icon displayed to toggle the collapsible.
     * @defaultValue appConfig.ui.icons.chevronDown
     */
    icon?: IconProps['name'];
    /**
     * The name displayed in the trigger label.
     * @defaultValue t('prose.collapsible.name')
     */
    name?: string;
    /**
     * The text displayed when the collapsible is open.
     * @defaultValue t('prose.collapsible.openText')
     */
    openText?: string;
    /**
     * The text displayed when the collapsible is closed.
     * @defaultValue t('prose.collapsible.closeText')
     */
    closeText?: string;
    class?: any;
    ui?: ProseCollapsible['slots'] & CollapsibleProps['ui'];
}
export interface ProseCollapsibleSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCollapsibleProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCollapsibleProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCollapsibleSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
