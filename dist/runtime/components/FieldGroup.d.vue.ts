import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/field-group';
import type { ComponentConfig } from '../types/tv';
type FieldGroup = ComponentConfig<typeof theme, AppConfig, 'fieldGroup'>;
export interface FieldGroupProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: FieldGroup['variants']['size'];
    /**
     * The orientation the buttons are laid out.
     * @defaultValue 'horizontal'
     */
    orientation?: FieldGroup['variants']['orientation'];
    class?: any;
    ui?: {
        base?: any;
    };
}
export interface FieldGroupSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<FieldGroupProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FieldGroupProps> & Readonly<{}>, {
    orientation: FieldGroup["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, FieldGroupSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
