import { inject, provide, computed, type ComputedRef, type InjectionKey } from 'vue'
import type { AvatarGroupProps } from '../types'

export const avatarGroupInjectionKey: InjectionKey<ComputedRef<{ size: AvatarGroupProps['size'] }>> = Symbol('nuxt-ui.avatar-group')

export function useAvatarGroup(props: { size: AvatarGroupProps['size'] }) {
  const injectedSize = inject(avatarGroupInjectionKey, undefined)

  const size = computed(() => props.size ?? injectedSize?.value.size)
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })))

  return {
    size
  }
}
