<script>
import theme from "#build/ui/page-body";
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
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageBody", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageBody || {} }));
</script>

<template>
  <Primitive :as="as" :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </Primitive>
</template>
