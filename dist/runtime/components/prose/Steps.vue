<script>
import theme from "#build/ui/prose/steps";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  level: { type: null, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.steps", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.steps || {} }));
</script>

<template>
  <div :class="ui({ class: [uiProp?.base, props.class], level: props.level })">
    <slot />
  </div>
</template>
