import { inject, provide, computed } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import type { AvatarGroupProps } from '../components/AvatarGroup.vue'
import { usePropIsSet } from '../utils/props'

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<{ size: AvatarGroupProps['size'], color: AvatarGroupProps['color'] }>> = Symbol('nuxt-ui.avatar-group')

/**
 * Reads `size` and `color` from a wrapping `<UAvatarGroup>`.
 *
 * **Always pass the raw `_props`, never the `useComponentProps` proxy** — the
 * fallback `props.size ?? avatarGroup?.value.size` must keep the wrapping group
 * winning over `<UTheme :props>`. To still apply theme defaults on bare avatars,
 * fall back to the proxy at the `tv()` call site: `size: size.value ?? props.size`.
 */
export function useAvatarGroup(props: { size: AvatarGroupProps['size'], color: AvatarGroupProps['color'] }) {
  const avatarGroup = inject(avatarGroupInjectionKey, undefined)

  const isSet = usePropIsSet(props)

  // Only what the parent passed: a `withDefaults` value stays below the group
  const size = computed(() => (isSet('size') ? props.size : undefined) ?? avatarGroup?.value.size)
  const color = computed(() => (isSet('color') ? props.color : undefined) ?? avatarGroup?.value.color)
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value, color: color.value })))

  return {
    size,
    color
  }
}
