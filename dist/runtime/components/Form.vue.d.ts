import type { VNode } from 'vue';
import type { FormSchema, FormError, FormInputEvents, FormErrorEvent, FormSubmitEvent, FormErrorWithId, InferInput, FormData } from '../types/form';
import type { FormHTMLAttributes } from '../types/html';
export type FormProps<S extends FormSchema, T extends boolean = true, N extends boolean = false> = {
    id?: string | number;
    /** Schema to validate the form state. Supports Standard Schema objects, Yup, Joi, and Superstructs. */
    schema?: S;
    /** An object representing the current state of the form. */
    state?: N extends false ? Partial<InferInput<S>> : never;
    /**
     * Custom validation function to validate the form state.
     * @param state - The current state of the form.
     * @returns A promise that resolves to an array of FormError objects, or an array of FormError objects directly.
     */
    validate?: (state: Partial<InferInput<S>>) => Promise<FormError[]> | FormError[];
    /**
     * The list of input events that trigger the form validation.
     * @remarks The form always validates on submit.
     * @defaultValue `['blur', 'change', 'input']`
     */
    validateOn?: FormInputEvents[];
    /** Disable all inputs inside the form. */
    disabled?: boolean;
    /**
     * Path of the form's state within it's parent form.
     * Used for nesting forms. Only available if `nested` is true.
     */
    name?: N extends true ? string : never;
    /**
     * Delay in milliseconds before validating the form on input events.
     * @defaultValue `300`
     */
    validateOnInputDelay?: number;
    /**
     * If true, applies schema transformations on submit.
     * @defaultValue `true`
     */
    transform?: T;
    /**
     * If true, this form will attach to its parent Form and validate at the same time.
     * @defaultValue `false`
     */
    nested?: N & boolean;
    /**
     * When `true`, all form elements will be disabled on `@submit` event.
     * This will cause any focused input elements to lose their focus state.
     * @defaultValue `true`
     */
    loadingAuto?: boolean;
    class?: any;
    ui?: {
        base?: any;
    };
    onSubmit?: ((event: FormSubmitEvent<FormData<S, T>>) => void | Promise<void>) | (() => void | Promise<void>);
} & /** @vue-ignore */ Omit<FormHTMLAttributes, 'name'>;
export interface FormEmits<S extends FormSchema, T extends boolean = true> {
    submit: [event: FormSubmitEvent<FormData<S, T>>];
    error: [event: FormErrorEvent];
}
export interface FormSlots {
    default?(props: {
        errors: FormError[];
        loading: boolean;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <S extends FormSchema, T extends boolean = true, N extends boolean = false>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<FormProps<S, T, N> & {
        onError?: ((event: FormErrorEvent) => any) | undefined;
        onSubmit?: ((event: FormSubmitEvent<FormData<S, T>>) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        validate: {
            <T_1 extends boolean>(opts: {
                name?: keyof InferInput<S> | (keyof InferInput<S>)[] | undefined;
                silent?: false | undefined;
                nested?: boolean;
                transform?: T_1 | undefined;
            }): Promise<FormData<S, T_1>>;
            <T_1 extends boolean>(opts: {
                name?: keyof InferInput<S> | (keyof InferInput<S>)[] | undefined;
                silent?: true | undefined;
                nested?: boolean;
                transform?: T_1 | undefined;
            }): Promise<FormData<S, T_1> | false>;
        };
        errors: import("vue").Ref<{
            id?: string | undefined;
            name?: string | undefined;
            message: string;
        }[], FormErrorWithId[] | {
            id?: string | undefined;
            name?: string | undefined;
            message: string;
        }[]>;
        setErrors(errs: FormError[], name?: keyof InferInput<S> | string | RegExp): void;
        submit(): Promise<void>;
        getErrors(name?: keyof InferInput<S> | string | RegExp): {
            id?: string | undefined;
            name?: string | undefined;
            message: string;
        }[];
        clear(name?: keyof InferInput<S> | string | RegExp): void;
        disabled: import("vue").ComputedRef<boolean>;
        loading: import("vue").Ref<boolean, boolean>;
        dirty: import("vue").ComputedRef<boolean>;
        dirtyFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<S>>>>;
        blurredFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<S>>>>;
        touchedFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<S>>>>;
    }>) => void;
    attrs: any;
    slots: FormSlots;
    emit: ((evt: "error", event: FormErrorEvent) => void) & ((evt: "submit", event: FormSubmitEvent<FormData<S, T>>) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
