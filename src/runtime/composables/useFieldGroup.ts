import type { InjectionKey, ComputedRef } from 'vue'
import { computed, defineComponent, inject, provide } from 'vue'
import type { FieldGroupProps } from '../components/FieldGroup.vue'
import type { GetObjectField } from '../types/utils'

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
 * **Always pass the raw `_props`, never the `useComponentProps` proxy** — the
 * fallback `props?.size ?? fieldGroup?.value.size` must keep the closer context
 * winning over `<UTheme :props>`. To still apply theme defaults on bare inputs,
 * fall back to the proxy at the `tv()` call site: `size: groupSize.value ?? props.size`.
 */
export function useFieldGroup<T>(props: Props<T>) {
  const fieldGroup = inject(fieldGroupInjectionKey, undefined)
  return {
    orientation: computed(() => fieldGroup?.value.orientation),
    size: computed(() => props?.size ?? fieldGroup?.value.size)
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
