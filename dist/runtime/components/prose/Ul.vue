<script>
import theme from "#build/ui/prose/ul";
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
const uiProp = useComponentUI("prose.ul", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.ul || {} }));
</script>

<template>
  <ul :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </ul>
</template>
