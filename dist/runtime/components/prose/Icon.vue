<script>
import theme from "#build/ui/prose/icon";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
import UIcon from "../Icon.vue";
const props = defineProps({
  name: { type: String, required: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.icon", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.icon || {} }));
</script>

<template>
  <UIcon :name="name" :class="ui({ class: [uiProp?.base, props.class] })" />
</template>
