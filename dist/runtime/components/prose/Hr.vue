<script>
import theme from "#build/ui/prose/hr";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.hr", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.hr || {} }));
</script>

<template>
  <hr :class="ui({ class: [uiProp?.base, props.class] })">
</template>
