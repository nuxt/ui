import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/auth-form';
import type { ButtonProps, FormProps, FormFieldProps, SeparatorProps, InputProps, CheckboxProps, SelectMenuProps, PinInputProps, IconProps, LinkPropsKeys } from '../types';
import type { FormSchema, FormSubmitEvent, InferInput } from '../types/form';
import type { FormHTMLAttributes } from '../types/html';
import type { NonUnion } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type AuthForm = ComponentConfig<typeof theme, AppConfig, 'authForm'>;
export type AuthFormCheckboxField = Omit<FormFieldProps, 'name'> & CheckboxProps & {
    name: string;
    type: 'checkbox';
};
export type AuthFormSelectField = Omit<FormFieldProps, 'name'> & SelectMenuProps & {
    name: string;
    type: 'select';
};
export type AuthFormOtpField = Omit<FormFieldProps, 'name'> & Omit<PinInputProps, 'type' | 'otp'> & {
    name: string;
    type: 'otp';
    /**
     * @deprecated Bind props directly in the field object.
     * The optional props for the `otp` type.
     * `{ otp: true }`{lang="ts-type"}
     */
    otp?: boolean | PinInputProps;
};
export type AuthFormInputFieldType = Required<InputProps>['type'];
export type AuthFormInputField<T extends AuthFormInputFieldType & NonUnion<T> = 'text'> = Omit<FormFieldProps, 'name'> & Omit<InputProps, 'type'> & {
    name: string;
    type: T;
};
export type AuthFormField = AuthFormCheckboxField | AuthFormSelectField | AuthFormOtpField | AuthFormInputField<AuthFormInputFieldType>;
export interface AuthFormProps<T extends FormSchema = FormSchema<object>, F extends AuthFormField = AuthFormField> extends /** @vue-ignore */ FormHTMLAttributes {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed above the title.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    title?: string;
    description?: string;
    fields?: F[];
    /**
     * Display a list of Button under the description.
     * `{ color: 'neutral', variant: 'subtle', block: true }`{lang="ts-type"}
     */
    providers?: ButtonProps[];
    /**
     * The text displayed in the separator.
     * @defaultValue 'or'
     */
    separator?: string | SeparatorProps;
    /**
     * Display a submit button at the bottom of the form.
     * `{ label: 'Continue', block: true }`{lang="ts-type"}
     */
    submit?: Omit<ButtonProps, LinkPropsKeys>;
    schema?: T;
    validate?: FormProps<T>['validate'];
    validateOn?: FormProps<T>['validateOn'];
    validateOnInputDelay?: FormProps<T>['validateOnInputDelay'];
    disabled?: FormProps<T>['disabled'];
    loading?: ButtonProps['loading'];
    loadingAuto?: FormProps<T>['loadingAuto'];
    class?: any;
    onSubmit?: FormProps<T>['onSubmit'];
    ui?: AuthForm['slots'];
}
export type AuthFormEmits<T extends object> = {
    submit: [payload: FormSubmitEvent<T>];
};
type DynamicFieldSlots<T, F, SlotProps = {
    field: F;
    state: T;
}> = Record<`${keyof T extends string ? keyof T : never}-field` | (string & {}), (props: SlotProps) => VNode[]>;
type DynamicFormFieldSlots<T> = Record<`${keyof T extends string ? keyof T : never}-${'label' | 'description' | 'hint' | 'help' | 'error'}` | (string & {}), (props?: {}) => VNode[]>;
export type AuthFormSlots<T extends object = object, F extends AuthFormField = AuthFormField> = {
    header?(props?: {}): VNode[];
    leading?(props: {
        ui: AuthForm['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    providers?(props?: {}): VNode[];
    separator?(props?: {}): VNode[];
    validation?(props?: {}): VNode[];
    submit?(props: {
        loading: boolean;
    }): VNode[];
    footer?(props?: {}): VNode[];
} & DynamicFieldSlots<T, F> & DynamicFormFieldSlots<T>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends FormSchema, F extends AuthFormField>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<AuthFormProps<T, F> & {
        onSubmit?: ((payload: FormSubmitEvent<import("vue").Reactive<InferInput<T>>>) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        formRef: Readonly<import("vue").ShallowRef<{
            validate: {
                <T_1 extends boolean>(opts: {
                    name?: keyof InferInput<T> | (keyof InferInput<T>)[] | undefined;
                    silent?: false | undefined;
                    nested?: boolean;
                    transform?: T_1 | undefined;
                }): Promise<import("../types").FormData<T, T_1>>;
                <T_1 extends boolean>(opts: {
                    name?: keyof InferInput<T> | (keyof InferInput<T>)[] | undefined;
                    silent?: true | undefined;
                    nested?: boolean;
                    transform?: T_1 | undefined;
                }): Promise<false | import("../types").FormData<T, T_1>>;
            };
            errors: {
                id?: string | undefined;
                name?: string | undefined;
                message: string;
            }[];
            setErrors: (errs: import("../types").FormError[], name?: string | RegExp | keyof InferInput<T> | undefined) => void;
            submit: () => Promise<void>;
            getErrors: (name?: string | RegExp | keyof InferInput<T> | undefined) => {
                id?: string | undefined;
                name?: string | undefined;
                message: string;
            }[];
            clear: (name?: string | RegExp | keyof InferInput<T> | undefined) => void;
            disabled: boolean;
            loading: boolean;
            dirty: boolean;
            dirtyFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
            blurredFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
            touchedFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
        } | null, {
            validate: {
                <T_1 extends boolean>(opts: {
                    name?: keyof InferInput<T> | (keyof InferInput<T>)[] | undefined;
                    silent?: false | undefined;
                    nested?: boolean;
                    transform?: T_1 | undefined;
                }): Promise<import("../types").FormData<T, T_1>>;
                <T_1 extends boolean>(opts: {
                    name?: keyof InferInput<T> | (keyof InferInput<T>)[] | undefined;
                    silent?: true | undefined;
                    nested?: boolean;
                    transform?: T_1 | undefined;
                }): Promise<false | import("../types").FormData<T, T_1>>;
            };
            errors: {
                id?: string | undefined;
                name?: string | undefined;
                message: string;
            }[];
            setErrors: (errs: import("../types").FormError[], name?: string | RegExp | keyof InferInput<T> | undefined) => void;
            submit: () => Promise<void>;
            getErrors: (name?: string | RegExp | keyof InferInput<T> | undefined) => {
                id?: string | undefined;
                name?: string | undefined;
                message: string;
            }[];
            clear: (name?: string | RegExp | keyof InferInput<T> | undefined) => void;
            disabled: boolean;
            loading: boolean;
            dirty: boolean;
            dirtyFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
            blurredFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
            touchedFields: ReadonlySet<import("vue").DeepReadonly<import("@vue/reactivity").UnwrapRefSimple<keyof InferInput<T>>>>;
        } | null>>;
        state: import("vue").Reactive<InferInput<T>>;
    }>) => void;
    attrs: any;
    slots: AuthFormSlots<import("vue").Reactive<InferInput<T>>, F>;
    emit: (evt: "submit", payload: FormSubmitEvent<import("vue").Reactive<InferInput<T>>>) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
