<script>
import theme from "#build/ui/prose/tabs-item";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentProps } from "../../composables/useComponentProps";
import { tv } from "../../utils/tv";
const _props = defineProps({
  label: { type: String, required: true },
  description: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const props = useComponentProps("prose.tabsItem", _props);
const appConfig = useAppConfig();
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.tabsItem || {} }));
</script>

<template>
  <div :class="ui({ class: [props.ui?.base, props.class] })">
    <slot>
      {{ props.description }}
    </slot>
  </div>
</template>
