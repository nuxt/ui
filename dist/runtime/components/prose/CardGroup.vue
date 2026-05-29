<script>
import theme from "#build/ui/prose/card-group";
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
defineSlots();
const props = useComponentProps("prose.cardGroup", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.cardGroup || {} }));
</script>

<template>
  <div :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </div>
</template>
