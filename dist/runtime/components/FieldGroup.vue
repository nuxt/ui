<script>
import theme from "#build/ui/field-group";
</script>

<script setup>
import { provide, computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../composables/useComponentProps";
import { fieldGroupInjectionKey } from "../composables/useFieldGroup";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false },
  size: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("fieldGroup", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.fieldGroup || {} }));
provide(fieldGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})));
</script>

<template>
  <Primitive :as="props.as" :data-orientation="props.orientation" :class="ui({ orientation: props.orientation, class: [props.ui?.base, props.class] })">
    <slot />
  </Primitive>
</template>
