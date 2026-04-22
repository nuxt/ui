<script>
import theme from "#build/ui/prose/tabs-item";
</script>

<script setup>
import { computed } from "vue";
import { useAppConfig } from "#imports";
import { useComponentUI } from "../../composables/useComponentUI";
import { tv } from "../../utils/tv";
const props = defineProps({
  label: { type: String, required: true },
  description: { type: String, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
});
defineSlots();
const appConfig = useAppConfig();
const uiProp = useComponentUI("prose.tabsItem", props);
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.ui?.prose?.tabsItem || {} }));
</script>

<template>
  <div :class="ui({ class: [uiProp?.base, props.class] })">
    <slot>
      {{ description }}
    </slot>
  </div>
</template>
