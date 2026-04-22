<script>
import theme from "#build/ui/prose/card-group";
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
const uiProp = useComponentUI("prose.cardGroup", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.cardGroup || {} }));
</script>

<template>
  <div :class="ui({ class: [uiProp?.base, props.class] })">
    <slot />
  </div>
</template>
