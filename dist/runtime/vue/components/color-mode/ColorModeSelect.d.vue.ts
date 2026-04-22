import type { SelectMenuProps, SelectMenuItem } from '../../../types';
export interface ColorModeSelectProps extends Omit<SelectMenuProps<SelectMenuItem[]>, 'icon' | 'items' | 'modelValue'> {
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ColorModeSelectProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ColorModeSelectProps> & Readonly<{}>, {
    searchInput: boolean | Omit<import("../../../types").InputProps, "modelValue" | "defaultValue">;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
