import type { ComputedRef } from 'vue';
import type { ClassValue } from 'tailwind-variants';
import type { TVConfig } from '../types/tv';
import type * as ui from '#build/ui';
type UIConfig = TVConfig<typeof ui>;
type ExtractUISlots<C> = C extends {
    slots?: infer S;
} ? NonNullable<S> : never;
type UIConfigSlots<T extends keyof UIConfig> = 'slots' extends keyof NonNullable<UIConfig[T]> ? ExtractUISlots<NonNullable<UIConfig[T]>> : {
    base?: ClassValue;
};
type ThemeSlotOverrides<T> = T extends {
    slots: infer S extends Record<string, any>;
} ? {
    [K in keyof S]?: ClassValue;
} : {
    [K in keyof T]?: T[K] extends Record<string, any> ? ThemeSlotOverrides<T[K]> : ClassValue;
};
export type ThemeUI = {
    [K in keyof typeof ui]?: ThemeSlotOverrides<(typeof ui)[K]>;
};
export type ThemeRootContext = {
    ui: ComputedRef<ThemeUI>;
};
declare const provideThemeContext: (contextValue: ThemeRootContext) => ThemeRootContext;
export { provideThemeContext };
type ComponentUIProps<T extends keyof UIConfig> = {
    ui?: UIConfigSlots<T>;
};
export declare function useComponentUI<T extends keyof UIConfig>(name: T, props: ComponentUIProps<T>): ComputedRef<UIConfigSlots<T>>;
export declare function useComponentUI(name: string, props: {
    ui?: any;
}): ComputedRef<any>;
