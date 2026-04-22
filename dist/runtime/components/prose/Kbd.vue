<script>
import theme from "#build/ui/prose/kbd";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
import UKbd from "../Kbd.vue";
const props = defineProps({
  value: { type: String, required: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.kbd", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.kbd || {} }));
</script>

<template>
  <UKbd :value="value" :class="ui({ class: [uiProp?.base, props.class] })" />
</template>
