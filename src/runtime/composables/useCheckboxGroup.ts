import type { InjectionKey, ComputedRef } from 'vue'
import { inject, computed } from 'vue'
import type { CheckboxGroupProps } from '../components/CheckboxGroup.vue'
import type { GetObjectField } from '../types/utils'

export const checkboxGroupInjectionKey: InjectionKey<ComputedRef<{
  size: CheckboxGroupProps['size']
  orientation: CheckboxGroupProps['orientation']
  variant: CheckboxGroupProps['variant']
  indicator: CheckboxGroupProps['indicator']
}>> = Symbol('nuxt-ui.checkbox-group')

type Props<T> = {
  size?: GetObjectField<T, 'size'>
  variant?: GetObjectField<T, 'variant'>
  indicator?: GetObjectField<T, 'indicator'>
}

export function useCheckboxGroup<T>(props: Props<T>) {
  const checkboxGroup = inject(checkboxGroupInjectionKey, undefined)
  return {
    orientation: computed(() => checkboxGroup?.value.orientation),
    size: computed(() => props?.size ?? checkboxGroup?.value.size),
    variant: computed(() => props?.variant ?? checkboxGroup?.value.variant),
    indicator: computed(() => props?.indicator ?? checkboxGroup?.value.indicator)
  }
}
