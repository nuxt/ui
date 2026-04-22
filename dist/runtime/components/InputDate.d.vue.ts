import type { ComponentPublicInstance, VNode } from 'vue';
import type { DateFieldRootProps, DateFieldRootEmits, DateRangeFieldRootProps, DateRangeFieldRootEmits, DateValue } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
import theme from '#build/ui/input-date';
type InputDate = ComponentConfig<typeof theme, AppConfig, 'inputDate'>;
type _DateFieldRootProps = Omit<DateFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>;
type _RangeDateFieldRootProps = Omit<DateRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>;
type InputDateDefaultValue<R extends boolean = false> = R extends true ? DateRangeFieldRootProps['defaultValue'] : DateFieldRootProps['defaultValue'];
type InputDateModelValue<R extends boolean = false> = (R extends true ? DateRangeFieldRootProps['modelValue'] : DateFieldRootProps['modelValue']) | undefined;
export interface InputDateProps<R extends boolean = false> extends UseComponentIconsProps, _DateFieldRootProps, _RangeDateFieldRootProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: InputDate['variants']['color'];
    /**
     * @defaultValue 'solid'
     */
    variant?: InputDate['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: InputDate['variants']['size'];
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /** Keep the mobile text size on all breakpoints. */
    fixed?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    /**
     * The icon to use as a range separator.
     * @defaultValue appConfig.ui.icons.minus
     * @IconifyIcon
     */
    separatorIcon?: IconProps['name'];
    /** Whether or not a range of dates can be selected */
    range?: R & boolean;
    defaultValue?: InputDateDefaultValue<R>;
    modelValue?: InputDateModelValue<R>;
    class?: any;
    ui?: InputDate['slots'];
}
export interface InputDateEmits<R extends boolean = false> extends Omit<DateFieldRootEmits & DateRangeFieldRootEmits, 'update:modelValue'> {
    'update:modelValue': [value: InputDateModelValue<R>];
    'change': [event: Event];
    'blur': [event: FocusEvent];
    'focus': [event: FocusEvent];
}
export interface InputDateSlots {
    leading?(props: {
        ui: InputDate['ui'];
    }): VNode[];
    default?(props: {
        ui: InputDate['ui'];
    }): VNode[];
    trailing?(props: {
        ui: InputDate['ui'];
    }): VNode[];
    separator?(props: {
        ui: InputDate['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <R extends boolean>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<InputDateProps<R> & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((value: InputDateModelValue<R>) => any) | undefined;
        "onUpdate:placeholder"?: ((...args: DateValue[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputsRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>) => void;
    attrs: any;
    slots: InputDateSlots;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "update:modelValue", value: InputDateModelValue<R>) => void) & ((evt: "update:placeholder", ...args: [date: DateValue] & [date: DateValue]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
