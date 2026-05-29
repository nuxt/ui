import { type VNode } from 'vue';
import type { ThemeDefaults, ThemeUI } from '../composables/useComponentProps';
export interface ThemeProps {
    /**
     * Per-component prop defaults that flow through `useComponentProps` to
     * every descendant. Each key maps to a partial of that component's props.
     * @example `{ button: { color: 'warning' }, tooltip: { delayDuration: 0 } }`
     */
    props?: ThemeDefaults;
    /**
     * Per-component slot class overrides (flat shorthand for `:props.<name>.ui`).
     * @example `{ button: { base: 'rounded-full' } }`
     */
    ui?: ThemeUI;
}
export interface ThemeSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ThemeProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ThemeProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ThemeSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
