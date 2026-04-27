import { inject, provide, computed } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import type { AvatarGroupProps } from '../types'

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<{ size: AvatarGroupProps['size'], color: AvatarGroupProps['color'] }>> = Symbol('nuxt-ui.avatar-group')

export function useAvatarGroup(props: { size: AvatarGroupProps['size'], color: AvatarGroupProps['color'] }) {
  const avatarGroup = inject(avatarGroupInjectionKey, undefined)

  const size = computed(() => props.size ?? avatarGroup?.value.size)
  const color = computed(() => props.color ?? avatarGroup?.value.color)
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value, color: color.value })))

  return {
    size,
    color
  }
}
