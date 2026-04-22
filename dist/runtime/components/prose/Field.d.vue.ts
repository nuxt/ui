import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '../../types/tv';
import theme from '#build/ui/prose/field';
type ProseField = ComponentConfig<typeof theme, AppConfig, 'field', 'ui.prose'>;
export interface ProseFieldProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The name of the field.
     */
    name?: string;
    /**
     * Expected type of the field's value
     */
    type?: string;
    /**
     * Description of the field
     */
    description?: string;
    /**
     * Indicate whether the field is required
     */
    required?: boolean;
    class?: any;
    ui?: ProseField['slots'];
}
export interface ProseFieldSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseFieldProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseFieldProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseFieldSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
