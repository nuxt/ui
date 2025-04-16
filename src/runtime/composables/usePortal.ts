import { inject, provide, computed, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export const portalTargetInjectionKey: InjectionKey<ComputedRef<string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export function usePortal(portal: Ref<string | HTMLElement | boolean | undefined>) {
  const portalTarget = inject(portalTargetInjectionKey, undefined)

  const to = computed(() => {
    if (typeof portal.value === 'string' || portal.value instanceof HTMLElement) {
      return portal.value
    }

    return portalTarget?.value ?? 'body'
  })

  const disabled = computed(() => typeof portal.value === 'boolean' ? !portal.value : false)

  provide(portalTargetInjectionKey, computed(() => to.value))

  return computed(() => (
    {
      to: to.value,
      disabled: disabled.value
    }
  ))
}
