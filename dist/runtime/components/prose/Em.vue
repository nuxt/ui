<script>
import theme from "#build/ui/prose/em";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  class: { type: String, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.em", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.em || {} }));
</script>

<template>
  <em :class="ui({ class: [uiProp?.base, props.class] })"><slot /></em>
</template>
