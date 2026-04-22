import type { ComponentPublicInstance, VNode } from 'vue';
import type { TimeFieldRootEmits, TimeFieldRootProps, TimeRangeFieldRootEmits, TimeRangeFieldRootProps, TimeValue } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/input-time';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type InputTime = ComponentConfig<typeof theme, AppConfig, 'inputTime'>;
type InputTimeDefaultValue<R extends boolean = false> = R extends true ? TimeRangeFieldRootProps['defaultValue'] : TimeFieldRootProps['defaultValue'];
type InputTimeModelValue<R extends boolean = false> = (R extends true ? TimeRangeFieldRootProps['modelValue'] : TimeFieldRootProps['modelValue']) | undefined;
type _TimeFieldRootProps = Omit<TimeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>;
type _TimeRangeFieldRootProps = Omit<TimeRangeFieldRootProps, 'as' | 'asChild' | 'modelValue' | 'defaultValue' | 'dir' | 'locale'>;
export interface InputTimeProps<R extends boolean = false> extends UseComponentIconsProps, _TimeFieldRootProps, _TimeRangeFieldRootProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: InputTime['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: InputTime['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: InputTime['variants']['size'];
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
    /**
     * Enable time range selection.
     * @defaultValue false
     */
    range?: R & boolean;
    /** The value of the input when initially rendered. Use when you do not need to control the state of the input. */
    defaultValue?: InputTimeDefaultValue<R>;
    /** The controlled value of the input. Can be bind as `v-model`. */
    modelValue?: InputTimeModelValue<R>;
    class?: any;
    ui?: InputTime['slots'];
}
export interface InputTimeEmits<R extends boolean = false> extends Omit<TimeFieldRootEmits & TimeRangeFieldRootEmits, 'update:modelValue'> {
    'update:modelValue': [value: InputTimeModelValue<R>];
    'change': [event: Event];
    'blur': [event: FocusEvent];
    'focus': [event: FocusEvent];
}
export interface InputTimeSlots {
    leading?(props: {
        ui: InputTime['ui'];
    }): VNode[];
    default?(props: {
        ui: InputTime['ui'];
    }): VNode[];
    trailing?(props: {
        ui: InputTime['ui'];
    }): VNode[];
    separator?(props: {
        ui: InputTime['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <R extends boolean>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<InputTimeProps<R> & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        "onUpdate:modelValue"?: ((value: InputTimeModelValue<R>) => any) | undefined;
        "onUpdate:placeholder"?: ((...args: TimeValue[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputsRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>) => void;
    attrs: any;
    slots: InputTimeSlots;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "update:modelValue", value: InputTimeModelValue<R>) => void) & ((evt: "update:placeholder", ...args: [date: TimeValue] & [date: TimeValue]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
