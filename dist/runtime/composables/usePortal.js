import { inject, computed } from "vue";
export const portalTargetInjectionKey = Symbol("nuxt-ui.portal-target");
export function usePortal(portal) {
  const globalPortal = inject(portalTargetInjectionKey, void 0);
  const value = computed(() => portal.value === true ? globalPortal?.value : portal.value);
  const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
  const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }));
}
