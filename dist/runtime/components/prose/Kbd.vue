<script>
import theme from "#build/ui/prose/kbd";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
import UKbd from "../Kbd.vue";
const _props = defineProps({
  value: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.kbd", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.kbd || {} }));
</script>

<template>
  <UKbd :value="props.value" :class="ui({ class: [props.ui?.base, props.class] })">
    <slot />
  </UKbd>
</template>
