<script>
import theme from "#build/ui/kbd";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { useKbd } from "../composables/useKbd";
import { useComponentProps } from "../composables/useComponentProps";
import { tv } from "../utils/tv";
const _props = defineProps({
  as: { type: null, required: false, default: "kbd" },
  value: { type: null, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("kbd", _props);
const { getKbdKey } = useKbd();
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.kbd || {} }));
</script>

<template>
  <Primitive :as="props.as" :class="ui({ class: [props.ui?.base, props.class], color: props.color, variant: props.variant, size: props.size })">
    <slot>
      {{ getKbdKey(props.value) }}
    </slot>
  </Primitive>
</template>
