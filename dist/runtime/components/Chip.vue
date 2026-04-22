<script>
import theme from "#build/ui/chip";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, Slot } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { useAvatarGroup } from "../composables/useAvatarGroup";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const props = defineProps({
  as: { type: null, required: false },
  text: { type: [String, Number], required: false },
  color: { type: null, required: false },
  size: { type: null, required: false },
  position: { type: null, required: false },
  inset: { type: Boolean, required: false, default: false },
  standalone: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const show = defineModel("show", { type: Boolean, ...{ default: true } });
const { size } = useAvatarGroup(props);
const appConfig = useAppConfig();
const uiProp = useComponentUI("chip", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chip || {} })({
  color: props.color,
  size: size.value,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone
}));
</script>

<template>
  <Primitive :as="as" data-slot="root" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span v-if="show" data-slot="base" :class="ui.base({ class: uiProp?.base })">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
