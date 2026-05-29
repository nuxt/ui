<script>
import theme from "#build/ui/prose/badge";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
import UBadge from "../Badge.vue";
const _props = defineProps({
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.badge", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.badge || {} }));
</script>

<template>
  <UBadge color="primary" variant="subtle" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot mdc-unwrap="p" />
  </UBadge>
</template>
