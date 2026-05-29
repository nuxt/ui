import type { ComputedRef, InjectionKey } from 'vue';
import type { AvatarGroupProps } from '../types';
export declare const avatarGroupInjectionKey: InjectionKey<ComputedRef<{
    size: AvatarGroupProps['size'];
    color: AvatarGroupProps['color'];
}>>;
/**
 * Reads `size` and `color` from a wrapping `<UAvatarGroup>`.
 *
 * **Always pass the raw `_props`, never the `useComponentProps` proxy** — the
 * fallback `props.size ?? avatarGroup?.value.size` must keep the wrapping group
 * winning over `<UTheme :props>`. To still apply theme defaults on bare avatars,
 * fall back to the proxy at the `tv()` call site: `size: size.value ?? props.size`.
 */
export declare function useAvatarGroup(props: {
    size: AvatarGroupProps['size'];
    color: AvatarGroupProps['color'];
}): {
    size: ComputedRef<"md" | "3xs" | "2xs" | "xs" | "sm" | "lg" | "xl" | "2xl" | "3xl" | undefined>;
    color: ComputedRef<any>;
};
