import { inject, provide, computed } from "vue";
export const avatarGroupInjectionKey = Symbol("nuxt-ui.avatar-group");
export function useAvatarGroup(props) {
  const avatarGroup = inject(avatarGroupInjectionKey, void 0);
  const size = computed(() => props.size ?? avatarGroup?.value.size);
  const color = computed(() => props.color ?? avatarGroup?.value.color);
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value, color: color.value })));
  return {
    size,
    color
  };
}
