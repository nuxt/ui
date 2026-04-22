import type { ConfigProviderProps, TooltipProviderProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { ToasterProps } from '../types';
import type { Locale, Messages } from '../types/locale';
export interface AppProps<T extends Messages = Messages> extends Omit<ConfigProviderProps, 'useId' | 'locale'> {
    tooltip?: TooltipProviderProps;
    toaster?: ToasterProps | null;
    locale?: Locale<T>;
    portal?: boolean | string | HTMLElement;
}
export interface AppSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends Messages>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<AppProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: AppSlots;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
