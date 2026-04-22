<script>
import theme from "#build/ui/prose/table";
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
const uiProp = useComponentUI("prose.table", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.table || {} })());
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })">
    <table :class="ui.base({ class: uiProp?.base })">
      <slot />
    </table>
  </div>
</template>
