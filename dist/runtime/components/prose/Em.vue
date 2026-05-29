<script>
import theme from "#build/ui/prose/em";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
const _props = defineProps({
  class: { type: String, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.em", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.em || {} }));
</script>

<template>
  <em :class="ui({ class: [props.ui?.base, props.class] })"><slot /></em>
</template>
