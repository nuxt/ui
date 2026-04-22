<script>
import theme from "#build/ui/skeleton";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import { useComponentUI } from "../composables/useComponentUI";
const props = defineProps({
  as: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const appConfig = useAppConfig();
const uiProp = useComponentUI("skeleton", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.skeleton || {} }));
</script>

<template>
  <Primitive
    :as="as"
    aria-busy="true"
    aria-label="loading"
    aria-live="polite"
    role="alert"
    :class="ui({ class: [uiProp?.base, props.class] })"
  >
    <slot />
  </Primitive>
</template>
