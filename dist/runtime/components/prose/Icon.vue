<script>
import theme from "#build/ui/prose/icon";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
import UIcon from "../Icon.vue";
const _props = defineProps({
  name: { type: String, required: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
const props = useComponentProps("prose.icon", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.icon || {} }));
</script>

<template>
  <UIcon :name="props.name" :class="ui({ class: [props.ui?.base, props.class] })" />
</template>
