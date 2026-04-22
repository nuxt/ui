<script>
import theme from "#build/ui/prose/li";
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
const uiProp = useComponentUI("prose.li", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.li || {} }));
</script>

<template>
  <li :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </li>
</template>
