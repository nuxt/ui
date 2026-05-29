<script>
import theme from "#build/ui/prose/hr";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
const _props = defineProps({
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const props = useComponentProps("prose.hr", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.hr || {} }));
</script>

<template>
  <hr :class="ui({ class: [props.ui?.base, props.class] })">
</template>
