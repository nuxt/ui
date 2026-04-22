import type { SwitchRootProps, SwitchRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/switch';
import type { IconProps } from '../types';
import type { ButtonHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type Switch = ComponentConfig<typeof theme, AppConfig, 'switch'>;
export interface SwitchProps<T = boolean> extends Pick<SwitchRootProps<T>, 'disabled' | 'id' | 'name' | 'required' | 'value' | 'defaultValue' | 'modelValue' | 'trueValue' | 'falseValue'>, /** @vue-ignore */ Omit<ButtonHTMLAttributes, 'type' | 'disabled' | 'name'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: Switch['variants']['color'];
    /**
     * @defaultValue 'md'
     */
    size?: Switch['variants']['size'];
    /** When `true`, the loading icon will be displayed. */
    loading?: boolean;
    /**
     * The icon when the `loading` prop is `true`.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * Display an icon when the switch is checked.
     * @IconifyIcon
     */
    checkedIcon?: IconProps['name'];
    /**
     * Display an icon when the switch is unchecked.
     * @IconifyIcon
     */
    uncheckedIcon?: IconProps['name'];
    label?: string;
    description?: string;
    class?: any;
    ui?: Switch['slots'];
}
export interface SwitchEmits<T = boolean> extends SwitchRootEmits<T> {
    change: [event: Event];
}
export interface SwitchSlots {
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
    props: import("vue").PublicProps & __VLS_PrettifyLocal<SwitchProps<T> & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((payload: T) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: SwitchSlots;
    emit: ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", payload: T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
