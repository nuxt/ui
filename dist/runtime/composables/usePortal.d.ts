import type { Ref, InjectionKey } from 'vue';
export declare const portalTargetInjectionKey: InjectionKey<Ref<boolean | string | HTMLElement>>;
export declare function usePortal(portal: Ref<boolean | string | HTMLElement | undefined>): import("vue").ComputedRef<{
    to: string | HTMLElement | undefined;
    disabled: boolean;
}>;
