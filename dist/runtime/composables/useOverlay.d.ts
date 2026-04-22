import type { Component } from 'vue';
import type { ComponentProps, ComponentEmit } from 'vue-component-type-helpers';
type CloseEventArgTypeSimple<T> = T extends (event: 'close', arg_0: infer Arg, ...args: any[]) => void ? Arg : never;
/**
 * This is a workaround for a design limitation in TypeScript.
 *
 * Conditional types only match the last function overload, not a union of all possible
 * parameter types. This workaround forces TypeScript to properly extract the 'close'
 * event argument type from component emits with multiple event signatures.
 *
 * @see https://github.com/microsoft/TypeScript/issues/32164
 */
type CloseEventArgTypeComplex<T> = T extends {
    (event: 'close', arg_0: infer Arg, ...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
    (...args: any[]): void;
} ? Arg : never;
type CloseEventArgType<T> = CloseEventArgTypeSimple<T> | CloseEventArgTypeComplex<T>;
export type OverlayOptions<OverlayAttrs = Record<string, any>> = {
    defaultOpen?: boolean;
    props?: OverlayAttrs;
    destroyOnClose?: boolean;
};
interface ManagedOverlayOptionsPrivate<T extends Component> {
    component?: T;
    id: symbol;
    isMounted: boolean;
    isOpen: boolean;
    originalProps?: ComponentProps<T>;
    resolvePromise?: (value: any) => void;
}
export type Overlay = OverlayOptions<Component> & ManagedOverlayOptionsPrivate<Component>;
type OverlayInstance<T extends Component> = Omit<ManagedOverlayOptionsPrivate<T>, 'component'> & {
    id: symbol;
    open: (props?: ComponentProps<T>) => OpenedOverlay<T>;
    close: (value?: any) => void;
    patch: (props: Partial<ComponentProps<T>>) => void;
};
type OpenedOverlay<T extends Component> = Omit<OverlayInstance<T>, 'open' | 'close' | 'patch' | 'modelValue' | 'resolvePromise'> & {
    result: Promise<CloseEventArgType<ComponentEmit<T>>>;
} & Promise<CloseEventArgType<ComponentEmit<T>>>;
declare function _useOverlay(): {
    overlays: import("vue").ShallowReactive<Overlay[]>;
    open: <T extends Component>(id: symbol, props?: ComponentProps<T>) => OpenedOverlay<T>;
    close: (id: symbol, value?: any) => void;
    closeAll: () => void;
    create: <T extends Component>(component: T, _options?: OverlayOptions<ComponentProps<T>>) => OverlayInstance<T>;
    patch: <T extends Component>(id: symbol, props: Partial<ComponentProps<T>>) => void;
    unmount: (id: symbol) => void;
    isOpen: (id: symbol) => boolean;
};
export declare const useOverlay: typeof _useOverlay;
export {};
