import { inject, provide, computed, type ComputedRef } from 'vue'
import type { AvatarGroupProps } from '#ui/types'

export function useAvatarGroup(props: { size: AvatarGroupProps['size'] }) {
  const injectedSize = inject<ComputedRef<AvatarGroupProps['size']> | undefined>('avatar-size', undefined)
  const size = computed(() => props.size ?? injectedSize?.value)
  provide('avatar-size', size)

  return {
    size
  }
}
