<script>
import theme from "#build/ui/page-list";
</script>

<script setup>
import { computed } from "vue";
import { Primitive } from "reka-ui";
import { useAppConfig } from "#imports";
import { tv } from "../utils/tv";
import { useComponentProps } from "../composables/useComponentProps";
const _props = defineProps({
  as: { type: null, required: false },
  divide: { type: Boolean, required: false, default: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("pageList", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.pageList || {} }));
</script>

<template>
  <Primitive :as="props.as" role="list" :class="ui({ class: [props.ui?.base, props.class], divide: props.divide })">
    <slot />
  </Primitive>
</template>
