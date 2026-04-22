import type { ComputedRef, InjectionKey } from 'vue';
import type { AvatarGroupProps } from '../types';
export declare const avatarGroupInjectionKey: InjectionKey<ComputedRef<{
    size: AvatarGroupProps['size'];
}>>;
export declare function useAvatarGroup(props: {
    size: AvatarGroupProps['size'];
}): {
    size: ComputedRef<"2xl" | "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "3xl" | undefined>;
};
