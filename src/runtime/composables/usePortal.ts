import { inject, provide, computed } from 'vue'
import type { Ref, InjectionKey } from 'vue'

export const portalTargetInjectionKey: InjectionKey<Ref<string | HTMLElement>> = Symbol('nuxt-ui.portal-target')

export function usePortal(portal: Ref<string | HTMLElement | boolean | undefined>) {
  const portalTarget = inject(portalTargetInjectionKey, undefined)

  const to = computed(() => {
    if (typeof portal.value === 'boolean' || portal.value === undefined) {
      return portalTarget?.value ?? 'body'
    }

    return portal.value
  })

  const disabled = computed(() => typeof portal.value === 'boolean' ? !portal.value : false)

  provide(portalTargetInjectionKey, computed(() => to.value))

  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }))
}
