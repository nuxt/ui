import type { CheckboxRootProps, CheckboxRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/checkbox';
import type { IconProps } from '../types';
import type { ButtonHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type Checkbox = ComponentConfig<typeof theme, AppConfig, 'checkbox'>;
export interface CheckboxProps<T = boolean> extends Pick<CheckboxRootProps<T>, 'disabled' | 'required' | 'name' | 'value' | 'id' | 'defaultValue' | 'modelValue' | 'trueValue' | 'falseValue'>, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    label?: string;
    description?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Checkbox['variants']['color'];
    /**
     * @defaultValue 'list'
     */
    variant?: Checkbox['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Checkbox['variants']['size'];
    /**
     * Position of the indicator.
     * @defaultValue 'start'
     */
    indicator?: Checkbox['variants']['indicator'];
    /**
     * The icon displayed when checked.
     * @defaultValue appConfig.ui.icons.check
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The icon displayed when the checkbox is indeterminate.
     * @defaultValue appConfig.ui.icons.minus
     * @IconifyIcon
     */
    indeterminateIcon?: IconProps['name'];
    class?: any;
    ui?: Checkbox['slots'];
}
export interface CheckboxEmits<T = boolean> extends CheckboxRootEmits<T> {
    change: [event: Event];
}
export interface CheckboxSlots {
    label?(props: {
        label: string | undefined;
    }): VNode[];
    description?(props: {
        description: string | undefined;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T = boolean>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<CheckboxProps<T> & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: "indeterminate" | T) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: CheckboxSlots;
    emit: ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: "indeterminate" | T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
