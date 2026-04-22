<script>
import theme from "#build/ui/prose/blockquote";
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
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.blockquote", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.blockquote || {} }));
</script>

<template>
  <blockquote :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </blockquote>
</template>
