import type { ComponentPublicInstance } from 'vue';
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pin-input';
import type { ComponentConfig } from '../types/tv';
type PinInput = ComponentConfig<typeof theme, AppConfig, 'pinInput'>;
type PinInputType = 'text' | 'number';
export interface PinInputProps<T extends PinInputType = 'text'> extends Pick<PinInputRootProps<T>, 'defaultValue' | 'disabled' | 'id' | 'mask' | 'modelValue' | 'name' | 'otp' | 'placeholder' | 'required' | 'type'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'primary'
     */
    color?: PinInput['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: PinInput['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: PinInput['variants']['size'];
    /**
     * The number of input fields.
     * @defaultValue 5
     */
    length?: number | string;
    autofocus?: boolean;
    autofocusDelay?: number;
    highlight?: boolean;
    /** Keep the mobile text size on all breakpoints. */
    fixed?: boolean;
    class?: any;
    ui?: PinInput['slots'];
}
export type PinInputEmits<T extends PinInputType = 'text'> = PinInputRootEmits<T> & {
    change: [event: Event];
    blur: [event: Event];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends PinInputType>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PinInputProps<T> & {
        onBlur?: ((event: Event) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: [T] extends ["number"] ? number[] : string[]) => any) | undefined;
        onComplete?: ((value: [T] extends ["number"] ? number[] : string[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputsRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>) => void;
    attrs: any;
    slots: {};
    emit: ((evt: "blur", event: Event) => void) & ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: [T] extends ["number"] ? number[] : string[]) => void) & ((evt: "complete", value: [T] extends ["number"] ? number[] : string[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
