import { inject, computed } from 'vue'
import type { Ref, InjectionKey } from 'vue'
import type { DialogPortalProps } from 'reka-ui'

export const portalTargetInjectionKey: InjectionKey<Ref<boolean | string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export type PortalProps = boolean | string | HTMLElement | DialogPortalProps

export function usePortal(portal: Ref<PortalProps | undefined>) {
  const globalPortal = inject(portalTargetInjectionKey, undefined)

  const value = computed((): boolean | string | HTMLElement | undefined => {
    const p = portal.value

    if (p === true) {
      return globalPortal?.value
    }

    if (typeof p === 'object' && p !== null && !(p instanceof HTMLElement)) {
      return p.to
    }

    return p
  })

  const disabled = computed(() => typeof value.value === 'boolean' ? !value.value : false)
  const to = computed(() => typeof value.value === 'boolean' ? 'body' : value.value)
  const forceMount = computed(() => {
    const p = portal.value
    return typeof p === 'object' && p !== null && !(p instanceof HTMLElement) && p.forceMount === true
  })

  return computed(() => ({
    to: to.value,
    disabled: disabled.value,
    forceMount: forceMount.value
  }))
}
