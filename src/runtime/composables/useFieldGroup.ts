import type { InjectionKey, ComputedRef } from 'vue'
import { computed, defineComponent, inject, provide } from 'vue'
import type { FieldGroupProps } from '../components/FieldGroup.vue'
import type { GetObjectField } from '../types/utils'
import { usePropIsSet } from '../utils/props'

export const fieldGroupInjectionKey: InjectionKey<ComputedRef<{
  size: FieldGroupProps['size']
  orientation: FieldGroupProps['orientation']
}>> = Symbol('nuxt-ui.field-group')

type Props<T> = {
  size?: GetObjectField<T, 'size'>
}

/**
 * Reads `size` / `orientation` from a wrapping `<UFieldGroup>` (or `<UButtonGroup>`, etc.).
 *
 * **Pass the object `defineProps` returns**: `size` is read from it only when
 * the parent passed it, so the closer context wins over a `withDefaults` value
 * and over `<UTheme :props>`. To still apply those on bare inputs, fall back
 * to the proxy at the `tv()` call site: `size: groupSize.value ?? props.size`.
 */
export function useFieldGroup<T>(props: Props<T>) {
  const fieldGroup = inject(fieldGroupInjectionKey, undefined)
  const isSet = usePropIsSet(props)
  return {
    orientation: computed(() => fieldGroup?.value.orientation),
    // Only what the parent passed: a `withDefaults` value stays below the group
    size: computed(() => (isSet('size') ? props?.size : undefined) ?? fieldGroup?.value.size)
  }
}

export const FieldGroupReset = defineComponent({
  name: 'FieldGroupReset',
  setup(_, { slots }) {
    provide(fieldGroupInjectionKey, computed(() => ({
      size: undefined,
      orientation: undefined
    })))
    return () => slots.default?.()
  }
})
