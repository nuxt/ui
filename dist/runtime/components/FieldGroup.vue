<script>
import theme from "#build/ui/field-group";
</script>

<script setup>
import { provide, computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../composables/useComponentUI";
import { fieldGroupInjectionKey } from "../composables/useFieldGroup";
import { tv } from "../utils/tv";
const props = defineProps({
  as: { type: null, required: false },
  size: { type: null, required: false },
  orientation: { type: null, required: false, default: "horizontal" },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("fieldGroup", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.fieldGroup || {} }));
provide(fieldGroupInjectionKey, computed(() => ({
  orientation: props.orientation,
  size: props.size
})));
</script>

<template>
  <Primitive :as="as" :data-orientation="orientation" :class="ui({ orientation, class: [uiProp?.base, props.class] })">
    <slot />
  </Primitive>
</template>
