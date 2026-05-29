<script>
import theme from "#build/ui/avatar-group";
</script>

<script setup>
import { computed, provide } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { avatarGroupInjectionKey } from "../composables/useAvatarGroup";
import { tv } from "../utils/tv";
import UAvatar from "./Avatar.vue";
const _props = defineProps({
  as: { type: null, required: false },
  size: { type: null, required: false },
  color: { type: null, required: false },
  max: { type: [Number, String], required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const slots = defineSlots();
const props = useComponentProps("avatarGroup", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.avatarGroup || {} })({
  size: props.size,
  color: props.color
}));
const max = computed(() => typeof props.max === "string" ? Number.parseInt(props.max, 10) : props.max);
const children = computed(() => {
  let children2 = slots.default?.();
  if (children2?.length) {
    children2 = children2.flatMap((child) => {
      if (typeof child.type === "symbol") {
        if (typeof child.children === "string") {
          return;
        }
        return child.children;
      }
      return child;
    }).filter(Boolean);
  }
  return children2 || [];
});
const visibleAvatars = computed(() => {
  if (!children.value.length) {
    return [];
  }
  if (!max.value || max.value <= 0) {
    return [...children.value].reverse();
  }
  return [...children.value].slice(0, max.value).reverse();
});
const hiddenCount = computed(() => {
  if (!children.value.length) {
    return 0;
  }
  return children.value.length - visibleAvatars.value.length;
});
provide(avatarGroupInjectionKey, computed(() => ({
  size: props.size,
  color: props.color
})));
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <UAvatar v-if="hiddenCount > 0" :text="`+${hiddenCount}`" data-slot="base" :class="ui.base({ class: props.ui?.base })" />
    <component :is="avatar" v-for="(avatar, count) in visibleAvatars" :key="count" data-slot="base" :class="ui.base({ class: props.ui?.base })" />
  </Primitive>
</template>
