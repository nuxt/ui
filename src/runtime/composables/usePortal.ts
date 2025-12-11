import { inject, computed } from 'vue'
import type { Ref, InjectionKey } from 'vue'

export const portalTargetInjectionKey: InjectionKey<Ref<boolean | string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export type PortalProp = boolean | string | HTMLElement | { to?: boolean | string | HTMLElement, forceMount?: boolean }

export function usePortal(portal: Ref<PortalProp | undefined>) {
  const globalPortal = inject(portalTargetInjectionKey, undefined)

  const value = computed(() => {
    // Boolean portal
    if (portal.value === true) {
      return globalPortal?.value
    }

    // Object portal
    if (typeof portal === 'object' && 'to' in portal) {
      // Boolean portal to value
      if (portal.to === true) {
        return globalPortal?.value
      }

      // Non-boolean object portal value
      return portal.to
    }

    // Non-boolean, non-object value fallback
    return portal.value
  })

  const disabled = computed(() => typeof value.value === 'boolean' ? !value.value : false)
  const to = computed(() => typeof value.value === 'boolean' ? 'body' : value.value)
  const forceMount = computed(() => 'forceMount' in portal && portal.forceMount === true)

  return computed(() => ({
    to: to.value,
    disabled: disabled.value,
    forceMount: forceMount.value
  }))
}
