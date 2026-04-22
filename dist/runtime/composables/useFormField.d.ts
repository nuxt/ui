import type { InjectionKey, Ref, ComputedRef } from 'vue';
import type { UseEventBusReturn } from '@vueuse/core';
import type { FormFieldProps } from '../types';
import type { FormErrorWithId, FormEvent, FormFieldInjectedOptions, FormInjectedOptions } from '../types/form';
import type { GetObjectField } from '../types/utils';
type Props<T> = {
    id?: string;
    name?: string;
    size?: GetObjectField<T, 'size'>;
    color?: GetObjectField<T, 'color'>;
    highlight?: boolean;
    disabled?: boolean;
};
export declare const formOptionsInjectionKey: InjectionKey<ComputedRef<FormInjectedOptions>>;
export declare const formBusInjectionKey: InjectionKey<UseEventBusReturn<FormEvent<any>, string>>;
export declare const formStateInjectionKey: InjectionKey<ComputedRef<Record<string, any> | undefined>>;
export declare const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>> | undefined>;
export declare const inputIdInjectionKey: InjectionKey<Ref<string | undefined>>;
export declare const formInputsInjectionKey: InjectionKey<Ref<Record<string, {
    id?: string;
    pattern?: RegExp;
}>>>;
export declare const formLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>>;
export declare const formErrorsInjectionKey: InjectionKey<Readonly<Ref<FormErrorWithId[]>>>;
export declare function useFormField<T>(props?: Props<T>, opts?: {
    bind?: boolean;
    deferInputValidation?: boolean;
}): {
    id: ComputedRef<string | undefined>;
    name: ComputedRef<string | undefined>;
    size: ComputedRef<"xs" | "sm" | "md" | "lg" | "xl" | NonNullable<GetObjectField<T, "size">> | undefined>;
    color: ComputedRef<"error" | GetObjectField<T, "color"> | undefined>;
    highlight: ComputedRef<boolean | undefined>;
    disabled: ComputedRef<boolean | undefined>;
    emitFormBlur: () => void;
    emitFormInput: import("@vueuse/shared").UseDebounceFnReturn<() => void>;
    emitFormChange: () => void;
    emitFormFocus: () => void;
    ariaAttrs: ComputedRef<Record<string, any> | undefined>;
};
export {};
