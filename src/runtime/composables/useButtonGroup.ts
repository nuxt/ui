import type { InjectionKey, ComputedRef } from 'vue'
import { inject, computed } from 'vue'
import type { ButtonGroupProps } from '../components/ButtonGroup.vue'
import type { GetObjectField } from '../types/utils'

export const buttonGroupInjectionKey: InjectionKey<ComputedRef<{
  size: ButtonGroupProps['size']
  orientation: ButtonGroupProps['orientation']
}>> = Symbol('nuxt-ui.button-group')

type Props<T> = {
  size?: GetObjectField<T, 'size'>
}

export function useButtonGroup<T>(props: Props<T>) {
  const buttonGroup = inject(buttonGroupInjectionKey, undefined)
  return {
    orientation: computed(() => buttonGroup?.value.orientation),
    size: computed(() => props?.size ?? buttonGroup?.value.size)
  }
}
