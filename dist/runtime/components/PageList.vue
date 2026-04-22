<script>
import theme from "#build/ui/page-list";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import { useComponentUI } from "../composables/useComponentUI";
const props = defineProps({
  as: { type: null, required: false },
  divide: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("pageList", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageList || {} }));
</script>

<template>
  <Primitive :as="as" role="list" :class="ui({ class: [uiProp?.base, props.class], divide: props.divide })">
    <slot />
  </Primitive>
</template>
