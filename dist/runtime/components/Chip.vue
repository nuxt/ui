<script>
import theme from "#build/ui/chip";
</script>

<script setup>
import { computed } from "vue";
import { Primitive, Slot } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { useAvatarGroup } from "../composables/useAvatarGroup";
import { tv } from "../utils/tv";
defineOptions({ inheritAttrs: false });
const _props = defineProps({
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
const props = useComponentProps("chip", _props);
const show = defineModel("show", { type: Boolean, ...{ default: true } });
const { size } = useAvatarGroup(_props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.chip || {} })({
  color: props.color,
  size: size.value ?? props.size,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone
}));
</script>

<template>
  <Primitive :as="props.as" data-slot="root" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span v-if="show" data-slot="base" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ props.text }}
      </slot>
    </span>
  </Primitive>
</template>
