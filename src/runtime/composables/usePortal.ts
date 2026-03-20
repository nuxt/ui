import { inject, computed } from 'vue'
import type { Ref, InjectionKey } from 'vue'

export const portalTargetInjectionKey: InjectionKey<Ref<boolean | string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export function usePortal(portal: Ref<boolean | string | HTMLElement | undefined>) {
  const globalPortal = inject(portalTargetInjectionKey, undefined)

  const value = computed(() => portal.value === true ? globalPortal?.value : portal.value)

  const disabled = computed(() => typeof value.value === 'boolean' ? !value.value : false)
  const to = computed(() => typeof value.value === 'boolean' ? 'body' : value.value)

  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }))
}
