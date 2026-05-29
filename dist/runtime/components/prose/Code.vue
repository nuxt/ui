<script>
import theme from "#build/ui/prose/code";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
const _props = defineProps({
  lang: { type: String, required: false },
  color: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.code", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.code || {} }));
</script>

<template>
  <code :class="ui({ class: [props.ui?.base, (props.class || '').split(',').join(' ')], color: props.color })">
    <slot />
  </code>
</template>
