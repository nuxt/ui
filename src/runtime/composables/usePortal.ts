import { inject, computed } from 'vue'
import type { Ref, InjectionKey } from 'vue'
import type { DialogPortalProps } from 'reka-ui'

export const portalTargetInjectionKey: InjectionKey<Ref<boolean | string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export type PortalProps = boolean | string | HTMLElement | DialogPortalProps

function isDialogPortalProps(p: unknown): p is DialogPortalProps {
  return typeof p === 'object' && p !== null && ('to' in p || 'disabled' in p || 'defer' in p || 'forceMount' in p)
}

export function usePortal(portal: Ref<PortalProps | undefined>) {
  const globalPortal = inject(portalTargetInjectionKey, undefined)

  const value = computed((): boolean | string | HTMLElement | undefined => {
    const p = portal.value

    if (p === true) {
      return globalPortal?.value
    }

    if (isDialogPortalProps(p)) {
      return p.to
    }

    return p
  })

  const disabled = computed(() => {
    const p = portal.value

    if (isDialogPortalProps(p) && p.disabled !== undefined) {
      return p.disabled
    }

    return typeof value.value === 'boolean' ? !value.value : false
  })

  const to = computed(() => {
    if (isDialogPortalProps(portal.value) && (typeof portal.value?.to === 'boolean' || typeof portal.value?.to === 'undefined')) {
      return 'body'
    }

    if (typeof value.value === 'boolean') {
      return 'body'
    }

    return value.value
  })
  const forceMount = computed(() => {
    const p = portal.value
    return isDialogPortalProps(p) && p.forceMount === true
  })

  return computed(() => ({
    to: to.value,
    disabled: disabled.value,
    forceMount: forceMount.value
  }))
}
