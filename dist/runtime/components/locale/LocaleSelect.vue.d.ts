import type { SelectMenuProps } from '../../types';
import type { Locale } from '../../types/locale';
export interface LocaleSelectProps extends Omit<SelectMenuProps<Locale<any>[], 'code', false>, 'items' | 'modelValue'> {
    locales?: Locale<any>[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<LocaleSelectProps & {
    modelValue: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<LocaleSelectProps & {
    modelValue: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    valueKey: "code";
    labelKey: import("../../types").GetItemKeys<Locale<any>[]>;
    searchInput: boolean | Omit<import("../Input.vue").InputProps, "modelValue" | "defaultValue">;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
