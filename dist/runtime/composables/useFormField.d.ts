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
/**
 * Wires an input to its wrapping `<UFormField>` (id/name/aria, validation events, error-driven color).
 *
 * **Always pass the raw `_props`, never the `useComponentProps` proxy.**
 * The internal fallback `props?.x ?? formField?.value.x` must distinguish
 * "explicit prop" from "theme default" — passing the proxy would leak
 * `<UTheme :props>` defaults into the explicit slot and let theme size/color
 * silently override the wrapping field (regression-tested in `Theme.spec.ts`).
 *
 * To get `<UTheme :props>` to apply when no `<UFormField>` wraps the input,
 * fall back to the proxy at the `tv()` call site:
 *
 * ```ts
 * size: size.value ?? props.size,
 * color: color.value ?? props.color,
 * highlight: highlight.value ?? props.highlight
 * ```
 *
 * Final precedence: `explicit > FormField > <UTheme :props> > withDefaults > app.config > tv defaults`.
 */
export declare function useFormField<T>(props?: Props<T>, opts?: {
    bind?: boolean;
    deferInputValidation?: boolean;
}): {
    id: ComputedRef<string | undefined>;
    name: ComputedRef<string | undefined>;
    size: ComputedRef<"md" | "xs" | "sm" | "lg" | "xl" | NonNullable<GetObjectField<T, "size">> | undefined>;
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
