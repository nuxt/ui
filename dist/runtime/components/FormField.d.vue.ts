import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/form-field';
import type { ComponentConfig } from '../types/tv';
type FormField = ComponentConfig<typeof theme, AppConfig, 'formField'>;
export interface FormFieldProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The name of the FormField. Also used to match form errors. */
    name?: string;
    /** A regular expression to match form error names. */
    errorPattern?: RegExp;
    label?: string;
    description?: string;
    help?: string;
    error?: boolean | string;
    hint?: string;
    /**
     * @defaultValue 'md'
     */
    size?: FormField['variants']['size'];
    required?: boolean;
    /** If true, validation on input will be active immediately instead of waiting for a blur event. */
    eagerValidation?: boolean;
    /**
     * Delay in milliseconds before validating the form on input events.
     * @defaultValue `300`
     */
    validateOnInputDelay?: number;
    /**
     * The orientation of the form field.
     * @defaultValue 'vertical'
     */
    orientation?: FormField['variants']['orientation'];
    class?: any;
    ui?: FormField['slots'];
}
export interface FormFieldSlots {
    label?(props: {
        label: string | undefined;
    }): VNode[];
    hint?(props: {
        hint: string | undefined;
    }): VNode[];
    description?(props: {
        description: string | undefined;
    }): VNode[];
    help?(props: {
        help: string | undefined;
    }): VNode[];
    error?(props: {
        error: string | true | undefined;
    }): VNode[];
    default?(props: {
        error: string | true | undefined;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<FormFieldProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FormFieldProps> & Readonly<{}>, {
    error: boolean | string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, FormFieldSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
